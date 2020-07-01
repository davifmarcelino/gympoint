import * as Yup from 'yup';
import Students from '../models/Students';

class StudentsController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      age: Yup.number().required(),
      height: Yup.number().required(),
      weight: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'error validation' });
    }

    if (await Students.findOne({ where: { email: req.body.email } })) {
      return res.status(401).json({ error: 'Email already exist' });
    }

    const { id, name, email, age, height, weight } = await Students.create(
      req.body
    );

    return res.json({ id, name, email, age, height, weight });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      age: Yup.number(),
      height: Yup.number(),
      weight: Yup.number(),
      email: Yup.string().email(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'error validation' });
    }
    if (await Students.findOne({ where: { email: req.body.email } })) {
      return res.status(400).json({ error: 'Email already exist' });
    }

    const student = await Students.findByPk(req.params.id);
    if (!student) {
      return res.status(400).json({ error: 'Student doesnt exist' });
    }
    const { id, name, age, weight, height } = await student.update(req.body);

    return res.json({ id, name, age, weight, height });
  }
}
export default new StudentsController();
