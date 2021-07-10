import {Request, Response} from 'express';
import ListSensorDataService from 'services/ListSensorDataService';


export default class SensorsController {
 
  public async index(
		request: Request,
		response: Response,
	): Promise<Response> {
    const {estufa_id} = request.query
    
		const listSensorData = new ListSensorDataService;

		const sensorData = await listSensorData.execute(Number(estufa_id));

		return response.json({ sensorData });
	}
}