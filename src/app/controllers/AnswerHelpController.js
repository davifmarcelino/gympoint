import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';
import AnswerHelpMail from '../jobs/AnswerHelpMail';
import Queue from '../../libs/Queue';

class AnswerHelpController {
  async store(req, res) {
    const helpOrder = await HelpOrder.findByPk(req.params.id, {
      attributes: ['id', 'question', 'answer', 'answer_at', 'student_id'],
      include: [
        { model: Student, as: 'student', attributes: ['name', 'email'] },
      ],
    });
    if (!helpOrder) {
      return res.json({ error: 'That help order does not exist' });
    }
    if (helpOrder.answer) {
      return res
        .status(400)
        .json({ error: 'That help order has already answered' });
    }

    const schema = Yup.object().shape({
      answer: Yup.string().max(255).required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Error validation' });
    }
    await helpOrder.update({
      answer: req.body.answer,
      answer_at: new Date(),
    });

    Queue.add(AnswerHelpMail.key, { helpOrder });

    return res.json(helpOrder);
  }
}

export default new AnswerHelpController();
