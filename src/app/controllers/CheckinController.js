import { isBefore, startOfDay, startOfWeek, endOfWeek } from 'date-fns';
import { Op } from 'sequelize';
import Checkin from '../models/Checkin';
import Registration from '../models/Registration';

class CheckinController {
  async store(req, res) {
    const registration = await Registration.findOne({
      where: { student_id: req.params.student_id },
    });

    if (!registration) {
      return res
        .status(400)
        .json({ error: 'Student does not registration or does not exist' });
    }

    if (isBefore(registration.end_date, startOfDay(new Date()))) {
      return res.status(401).json({ error: 'Your registration is expired' });
    }

    const startWeek = startOfWeek(new Date());
    const endWeek = endOfWeek(new Date());

    const checkins = await Checkin.findAll({
      where: {
        created_at: { [Op.between]: [startWeek, endWeek] },
        student_id: req.params.student_id,
      },
    });

    if (checkins.length >= 5) {
      return res
        .status(401)
        .json({ error: 'You have already used all of weeks check-in' });
    }

    const { student_id } = await Checkin.create(req.params);

    return res.json({ student_id });
  }

  async show(req, res) {
    const checkins = await Checkin.findAll({
      where: { student_id: req.params.student_id },
    });

    if (!checkins) {
      return res
        .status(400)
        .json('Student has never done check in or he does not exist');
    }

    return res.json(checkins);
  }
}

export default new CheckinController();
