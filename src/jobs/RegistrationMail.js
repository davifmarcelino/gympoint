import Mail from '../libs/Mail';

class RegistrationMail {
  get key() {
    return 'RegistrationMail';
  }

  async handle({ data }) {
    const { registration } = data;
    Mail.sendMail(registration);
  }
}

export default new RegistrationMail();
