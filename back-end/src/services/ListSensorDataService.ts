import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import SensorData from '../infra/typeorm/entities/SensorData';


class ListSensorDataService {
	public async execute(estufa_id: number): Promise<SensorData[]> {
    const sensorDataRepository = getRepository(SensorData)
    
    const greenHouses = sensorDataRepository.find({where: {greenhouse_id: estufa_id}});
		
		return greenHouses;
	}
}

export default ListSensorDataService;