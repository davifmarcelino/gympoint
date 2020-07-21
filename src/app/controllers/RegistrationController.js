import * as Yup from 'yup';
import { parseISO, isBefore, startOfDay, addMonths } from 'date-fns';
import Registration from '../models/Registration';
import Student from '../models/Student';
import Plan from '../models/Plan';
import Queue from '../../libs/Queue';
import RegistrationMail from '../jobs/RegistrationMail';

class RegistrationController {
  async store(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date().required(),
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Error validation' });
    }

    const { student_id, plan_id, start_date } = req.body;

    const startDay = startOfDay(parseISO(start_date));
    if (isBefore(startDay, startOfDay(new Date()))) {
      return res.status(400).json({ error: 'Star date is before today' });
    }

    const alreadyRegist = await Registration.findOne({
      where: { student_id },
    });
    if (alreadyRegist) {
      return res.status(400).json({ error: 'Student already registration' });
    }

    const student = await Student.findByPk(student_id);
    if (!student) {
      return res.status(400).json({ error: 'Student does not exist' });
    }

    const plan = await Plan.findByPk(plan_id);
    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exist' });
    }

    const endDay = addMonths(startDay, plan.duration);

    const registration = await Registration.create({
      student_id,
      plan_id,
      start_date: startDay,
      end_date: endDay,
      price: plan.price,
    });

    await Queue.add(RegistrationMail.key, { registration, plan, student });

    return res.json({
      student_id,
      plan_id,
      startDay,
      endDay,
      plan: plan.price,
    });
  }

  async index(req, res) {
    const { page = 1 } = req.query;

    const registrations = Registration.findAll({
      order: ['end_date'],
      attributes: ['start_date', 'price', 'end_date'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['title'],
        },
      ],
    });

    if (!registrations) {
      return res.status(400).json({ error: 'Nobody student found' });
    }

    return res.json(registrations);
  }

  async update(req, res) {
    const registration = await Registration.findByPk(req.params.id);
    if (!registration) {
      return res.status(400).json({ error: 'registration does not exist' });
    }

    const schema = Yup.object().shape({
      start_date: Yup.date(),
      plan_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Error validation' });
    }
    const { plan_id, start_date } = req.body;

    if (start_date) {
      const startDay = startOfDay(parseISO(start_date));
      if (isBefore(startDay, startOfDay(new Date()))) {
        return res.status(400).json({ error: 'Date is before today' });
      }
      registration.start_date = startDay;
      if (!plan_id || registration.plan_id === plan_id) {
        const plan = await Plan.findByPk(registration.plan_id);
        registration.end_date = addMonths(startDay, plan.duration);
      }
    }

    if (plan_id && registration.plan_id !== plan_id) {
      const plan = await Plan.findByPk(plan_id);
      if (!plan) {
        return res.status(400).json({ error: 'Plan does not ' });
      }
      registration.end_date = addMonths(registration.start_date, plan.duration);
      registration.price = plan.price;
    }

    const { student_id, price, end_date } = await registration.save();

    return res.json({
      student_id,
      plan_id,
      start_date: registration.start_date,
      price,
      end_date,
    });
  }

  async delete(req, res) {
    const registration = await Registration.destroy({
      where: { id: req.params.id },
    });

    if (!registration) {
      return res.status(400).json({ error: 'Registration did not find' });
    }
    return res.json({ success: 'Registration was deleted' });
  }
}

export default new RegistrationController();
