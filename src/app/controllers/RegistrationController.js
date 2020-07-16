import * as Yup from 'yup';
import { parseISO, isBefore, startOfDay, addMonths } from 'date-fns';
import Registrantion from '../models/Registration';
import Student from '../models/Student';
import Plan from '../models/Plan';

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
    if (await isBefore(startDay, startOfDay(new Date()))) {
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

    const { price } = await Registrantion.create({
      student_id,
      plan_id,
      start_date: startDay,
      end_date: endDay,
      price: plan.price,
    });

    return res.json({ student_id, plan_id, startDay, endDay, price });
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
}

export default new RegistrantionController();
