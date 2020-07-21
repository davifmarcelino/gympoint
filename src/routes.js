import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';
import StudentsController from './app/controllers/StudentsController';
import PlansController from './app/controllers/PlansController';
import RegistrationController from './app/controllers/RegistrationController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrderController from './app/controllers/HelpOrderController';
import AnswerHelpController from './app/controllers/AnswerHelpController';

const routes = new Router();

routes.post('/session', SessionController.store);

routes.post('/checkin/:student_id', CheckinController.store);
routes.get('/checkin/:student_id', CheckinController.show);

routes.post('/help-order/:student_id', HelpOrderController.store);
routes.get('/help-order/:student_id', HelpOrderController.show);

routes.use(authMiddleware);

routes.post('/plans', PlansController.store);
routes.put('/plans/:id', PlansController.update);
routes.get('/plans', PlansController.index);
routes.get('/plans/:id', PlansController.show);
routes.delete('/plans/:id', PlansController.delete);

routes.post('/students', StudentsController.store);
routes.put('/students/:id', StudentsController.update);

routes.post('/registration', RegistrationController.store);
routes.get('/registration', RegistrationController.index);
routes.put('/registration/:id', RegistrationController.update);
routes.delete('/registration/:id', RegistrationController.delete);

routes.post('/help-order/:id/answer', AnswerHelpController.store);

export default routes;
