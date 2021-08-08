import SensorData from 'infra/typeorm/entities/SensorData';
import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

interface SensorDataDTO{
  id_estufa: number;
  type: string;
  temp: number;
  ec: number;
  ph: number;
  adc_ph: number;
  adc_ec: number;
}

class SaveSensorDataService {
	public async execute({ id_estufa, type,  temp, ec, ph, adc_ph, adc_ec }: SensorDataDTO): Promise<void> {
    const sensorDataRepository = getRepository(SensorData)

    const sensorData = sensorDataRepository.create({
      temperature: temp, 
      conductivity: ec, 
      ph, 
      greenhouse_id: id_estufa,
      adc_ph,
      adc_ec
    });

    sensorDataRepository.save(sensorData)

	}
}

export default SaveSensorDataService;