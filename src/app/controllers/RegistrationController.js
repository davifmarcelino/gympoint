import * as Yup from 'yup';
import { parseISO, isBefore, startOfDay, addMonths } from 'date-fns';
import Registrantion from '../models/Registration';
import Student from '../models/Student';
import Plan from '../models/Plan';
import Queue from '../../libs/Queue';
import RegistrantionMail from '../../jobs/RegistrationMail';

class RegistrantionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date().required(),
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
    });
    if (await schema.isValid(req.body)) {
      return res.status(400).json({ error: 'Error validation' });
    }

    const { student_id, plan_id, start_date } = req.body;

    const startDay = startOfDay(parseISO(start_date));
    if (isBefore(startDay, startOfDay(new Date()))) {
      return res.status(400).json({ error: 'Star date is before today' });
    }

    const alreadyRegist = await Registrantion.findOne({
      where: { student_id },
    });
    if (alreadyRegist) {
      return res.status(400).json({ error: 'Student already registrantion' });
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

    const registrantion = await Registrantion.create(
      {
        student_id,
        plan_id,
        start_date: startDay,
        end_date: endDay,
        price: plan.price,
      },
      {
        include: [
          { model: Student, as: 'student', attributes: ['name', 'email'] },
          { model: Plan, as: 'plan', attributes: ['name'] },
        ],
      }
    );

    await Queue.add(RegistrantionMail.key, { registrantion });

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

    const registrantions = Registrantion.findAll({
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

    if (!registrantions) {
      return res.status(400).json({ error: 'Nobody student found' });
    }

    return res.json(registrantions);
  }

  async update(req, res) {
    const registrantion = await Registrantion.findByPk(req.params.id);
    if (!registrantion) {
      return res.status(400).json({ error: 'registrantion does not exist' });
    }

    const schema = Yup.object().shape({
      plan_id: Yup.number(),
      start_date: Yup.date(),
    });

    if (await schema.isValid(req.body)) {
      return res.status(400).json({ error: 'Error validation' });
    }
    const {
      plan_id = registrantion.plan_id,
      start_date = registrantion.start_date,
    } = req.body;

    const startDay = startOfDay(parseISO(start_date));

    if (registrantion.start_date !== startDay) {
      if (isBefore(startDay, startDay(new Date()))) {
        return res.status(400).json({ error: 'Date is before today' });
      }
      registrantion.start_date = startDay;
      if (registrantion.plan_id === plan_id) {
        const plan = await Plan.findByPk(plan_id);
        registrantion.end_date = addMonths(startDay, plan.duration);
      }
    }

    if (registrantion.plan_id !== plan_id) {
      const plan = await Plan.findByPk(plan_id);
      if (!plan) {
        return res.status(400).json({ error: 'Plan does not ' });
      }
      registrantion.end_date = addMonths(startDay, plan.duration);
      registrantion.price = plan.price;
    }

    const { student_id, price, end_date } = await registrantion.save();

    return res.json({
      student_id,
      plan_id,
      start_date: startDay,
      price,
      end_date,
    });
  }

  async delete(req, res) {
    const registrantion = await Registrantion.destroy({
      where: { id: req.params.id },
    });

    if (registrantion) {
      return res.status(400).json({ error: 'Registration did not find' });
    }
    return res.json({ success: 'Registration was deleted' });
  }
}

export default new RegistrantionController();
