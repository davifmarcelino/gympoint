import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlansController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Error validation' });
    }

    const existPlan = await Plan.findOne({ where: { title: req.body.title } });

    if (existPlan) {
      return res.status(400).json({ error: 'That title already exist' });
    }

    const { id, title, duration, price } = await Plan.create(req.body);
    return res.json({ id, title, duration, price });
  }

  async index(req, res) {
    const plans = await Plan.findAll({
      attributes: ['id', 'title', 'duration', 'price'],
    });

    return res.json(plans);
  }

  async show(req, res) {
    const plan = await Plan.findByPk(req.params.id);
    if (!plan) {
      return res.status(400).json({ error: 'Plan was not find' });
    }
    const { id, title, duration, price } = plan;
    return res.json({ id, title, duration, price });
  }

  async update(req, res) {
    const plan = await Plan.findByPk(req.params.id);

    if (!plan) {
      return res.status(400).json({ error: 'Plan was not find' });
    }

    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number(),
      price: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Error validation' });
    }

    const { title: newTitle } = req.body;

    if (newTitle && newTitle !== plan.title) {
      const existName = await Plan.findOne({
        where: { title: newTitle },
      });
      if (existName) {
        return res.status(400).json({ error: 'That title already exist' });
      }
    }

    const { id, title, duration, price } = await plan.update(req.body);

    return res.json({ id, title, duration, price });
  }

  async delete(req, res) {
    const plan = await Plan.destroy({ where: { id: req.params.id } });

    if (!plan) {
      return res.status(400).json({ error: 'Plan was not find' });
    }

    return res.json({ success: 'Plan was delete' });
  }
}

export default new PlansController();
