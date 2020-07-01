import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import Admins from '../models/Admins';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ erro: 'error validation' });
    }

    const { email, password } = req.body;

    const admin = await Admins.findOne({ where: { email } });

    if (!admin) {
      return res.status(401).json({ erro: 'Email not found' });
    }

    if (!(await admin.checkpassword(password))) {
      return res.status(401).json({ erro: 'Password is wrong' });
    }

    const { id, name } = admin;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expires,
      }),
    });
  }
}

export default new SessionController();
