import Bee from 'bee-queue';
import RegistrationMail from '../app/jobs/RegistrationMail';
import AnswerHelpMail from '../app/jobs/AnswerHelpMail';
import redisConfig from '../config/redis';

const jobs = [RegistrationMail, AnswerHelpMail];

class Queue {
  constructor() {
    this.queues = {};

    this.init();
  }

  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, { redis: redisConfig }),
        handle,
      };
    });
  }

  add(queue, job) {
    this.queues[queue].bee.createJob(job).save();
  }

  processQueue() {
    jobs.forEach((job) => {
      const { bee, handle } = this.queues[job.key];
      bee.process(handle);
    });
  }
}
export default new Queue();
