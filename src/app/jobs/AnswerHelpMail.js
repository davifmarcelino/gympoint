import Mail from '../../libs/Mail';

class AnswerHelpMail {
  get key() {
    return 'AnswerHelpMail';
  }

  async handle({ data }) {
    const { helpOrder } = data;

    Mail.sendMail({
      to: `${helpOrder.student.name} <${helpOrder.student.email}>`,
      template: 'answerHelp',
      subject: 'Sua duvida da GymPoint foi respondida',
      context: {
        student: helpOrder.student.name,
        question: helpOrder.question,
        answer: helpOrder.answer,
      },
    });
  }
}

export default new AnswerHelpMail();
