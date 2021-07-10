import SensorData from 'infra/typeorm/entities/SensorData';
import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

interface SensorDataDTO{
  estufa_id: number;
  temperature: number;
  conductivity: number;
  ph: number;
}

class SaveSensorDataService {
	public async execute({ estufa_id, temperature, conductivity, ph }: SensorDataDTO): Promise<void> {
    const sensorDataRepository = getRepository(SensorData)

    const sensorData = sensorDataRepository.create({
      temperature, conductivity, ph, greenhouse_id: estufa_id
    });

    sensorDataRepository.save(sensorData)

	}
}

export default SaveSensorDataService;