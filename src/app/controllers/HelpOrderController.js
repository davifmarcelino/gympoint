import * as Yup from 'yup';
import Student from '../models/Student';
import HelpOrder from '../models/HelpOrder';

class HelpOrderController {
  async store(req, res) {
    const student = await Student.findByPk(req.params.student_id);
    if (!student) {
      return res.status(400).json({ error: 'Student did not find' });
    }

    const schema = Yup.object().shape({
      question: Yup.string().max(255).required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Error validation' });
    }

    const { student_id, question } = await HelpOrder.create({
      question: req.body.question,
      student_id: req.params.student_id,
    });

    return res.json({ student_id, question });
  }

  async show(req, res) {
    const helpOrders = await HelpOrder.findAll({
      where: { student_id: req.params.st },
      attributes: ['student_id', 'question', 'answer', 'answer_at'],
      include: [{ model: Student, as: 'student', attributes: ['name'] }],
    });

    if (!helpOrders) {
      return res.status(400).json({
        error: 'There are not any questions or student does not exist',
      });
    }

    return res.json(helpOrders);
  }
}

export default new HelpOrderController();
