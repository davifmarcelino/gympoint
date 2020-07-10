import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';
import StudentsController from './app/controllers/StudentsController';
import PlansController from './app/controllers/PlansController';

const routes = new Router();

routes.post('/session', SessionController.store);

routes.use(authMiddleware);

routes.post('/plans', PlansController.store);
routes.put('/plans/:id', PlansController.update);
routes.get('/plans', PlansController.index);
routes.get('/plans/:id', PlansController.show);
routes.delete('/plans/:id', PlansController.delete);
routes.post('/students', StudentsController.store);
routes.put('/students/:id', StudentsController.update);

export default routes;
