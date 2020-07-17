import { parseISO, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../libs/Mail';

class RegistrationMail {
  get key() {
    return 'RegistrationMail';
  }

  async handle({ data }) {
    const { registration } = data;
    Mail.sendMail({
      to: `${registration.student.name} <${registration.student.email}>`,
      subject: 'Bem Vindo a GymPoint',
      template: 'registration',
      context: {
        student: registration.student.name,
        plan: registration.plan.name,
        price: registration.price,
        start: format(parseISO(registration.start_date), "dd'/'MM'/'yyyy", {
          locale: pt,
        }),
        end: format(parseISO(registration.end_date), "dd'/'MM'/'yyyy", {
          locale: pt,
        }),
      },
    });
  }
}

export default new RegistrationMail();
