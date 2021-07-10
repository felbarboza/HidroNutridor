import express, { request, response } from 'express';
// import SensorsController from './controllers/SensorsController';
import UserController from './controllers/UserController';
import SessionController from './controllers/SessionController';
import GreenHouseController from './controllers/GreenHouseController';
import ensureAuthenticated from 'middlewares/ensureAuthenticated';
import SensorsController from './controllers/SensorsController';

const routes = express.Router();

const sensorsControllers = new SensorsController();
const usersController = new UserController();
const sessionController = new SessionController();
const greenHouseController = new GreenHouseController();

// routes.post('/sensor', sensorsControllers.create);
// routes.get('/sensor', sensorsControllers.index);

routes.post('/users', usersController.create);
routes.post('/session', sessionController.create);
routes.post('/greenhouse', ensureAuthenticated, greenHouseController.create);
routes.get('/greenhouse', ensureAuthenticated, greenHouseController.index);
routes.get('/sensor_data', ensureAuthenticated, sensorsControllers.index);


export default routes;