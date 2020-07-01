import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';
import StudentsCotroller from './app/controllers/StudentsController';

const routes = new Router();

routes.post('/session', SessionController.store);

routes.use(authMiddleware);

routes.post('/students', StudentsCotroller.store);
routes.put('/students/:id', StudentsCotroller.update);
export default routes;
