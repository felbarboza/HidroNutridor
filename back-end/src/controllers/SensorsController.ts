import {Request, Response} from 'express';
import ListSensorDataService from 'services/ListSensorDataService';


export default class SensorsController {
 
  public async index(
		request: Request,
		response: Response,
	): Promise<Response> {
    	const {estufa_id, number_of_readings} = request.query
    
		const listSensorData = new ListSensorDataService;

		const sensorData = await listSensorData.execute(Number(estufa_id), Number(number_of_readings));

		return response.json({ sensorData });
	}
}