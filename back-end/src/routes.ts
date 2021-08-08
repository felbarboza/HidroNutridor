import express, { request, response } from 'express';
// import SensorsController from './controllers/SensorsController';
import UserController from './controllers/UserController';
import SessionController from './controllers/SessionController';
import GreenHouseController from './controllers/GreenHouseController';
import ensureAuthenticated from 'middlewares/ensureAuthenticated';
import SensorsController from './controllers/SensorsController';
import ActivationTimeController from 'controllers/ActivationTimeController';
import CalibrationController from 'controllers/CalibrationController';

const routes = express.Router();

const sensorsControllers = new SensorsController();
const usersController = new UserController();
const sessionController = new SessionController();
const greenHouseController = new GreenHouseController();
const activationTimeController = new ActivationTimeController()
const calibrationController = new CalibrationController()

// routes.post('/sensor', sensorsControllers.create);
// routes.get('/sensor', sensorsControllers.index);

routes.post('/users', usersController.create);
routes.post('/session', sessionController.create);
routes.post('/greenhouse', ensureAuthenticated, greenHouseController.create);
routes.get('/greenhouse', ensureAuthenticated, greenHouseController.index);
routes.delete('/greenhouse', ensureAuthenticated, greenHouseController.delete);
routes.get('/sensor_data', ensureAuthenticated, sensorsControllers.index);
routes.post('/activation_time', ensureAuthenticated, activationTimeController.create);
routes.get('/activation_time', ensureAuthenticated, activationTimeController.index);
routes.delete('/activation_time', ensureAuthenticated, activationTimeController.delete);
routes.post('/ph_calibration_low', ensureAuthenticated, calibrationController.low_ph);
routes.post('/ph_calibration_high', ensureAuthenticated, calibrationController.high_ph);
routes.post('/conductivity_calibration', ensureAuthenticated, calibrationController.conductivity);


export default routes;