import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import SensorData from '../infra/typeorm/entities/SensorData';


class ListSensorDataService {
	public async execute(estufa_id: number, number_of_readings: number): Promise<SensorData[]> {
    const sensorDataRepository = getRepository(SensorData)
    
    const greenHouses = sensorDataRepository.find(
		{
			where: {
				greenhouse_id: estufa_id
			}, 
			order:{
				created_at: "DESC"	
			},
			take: number_of_readings
		}
	);
		
		return greenHouses;
	}
}

export default ListSensorDataService;