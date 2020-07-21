import { parseISO, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../libs/Mail';

class RegistrationMail {
  get key() {
    return 'RegistrationMail';
  }

  async handle({ data }) {
    const { registration, plan, student } = data;

    Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Bem Vindo a GymPoint',
      template: 'registration',
      context: {
        student: student.name,
        plan: plan.name,
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
