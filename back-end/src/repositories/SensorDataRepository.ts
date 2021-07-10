import { getRepository, Repository } from 'typeorm';
import SensorData from '../infra/typeorm/entities/SensorData';

interface CreateSensorDataDTO{
  temperature: number;
  ph: number;
  conductivity: number;
  greenhouse_id: number;
}

class SensorDataRepository {
	private ormRepository: Repository<SensorData>;

	constructor() {
		this.ormRepository = getRepository(SensorData);
	}

	public async findByGreenHouseID(id: string): Promise<SensorData[]> {
		const sensorData = await this.ormRepository.find({
      where:{greenhouse_id: id}
    });

		return sensorData;
	}

	public async create(sensorData: CreateSensorDataDTO): Promise<SensorData> {
		const newSensorData = this.ormRepository.create(sensorData);

		await this.ormRepository.save(newSensorData);

		return newSensorData;
	}

	public async save(sensorData: SensorData): Promise<SensorData> {
		return this.ormRepository.save(sensorData);
	}
}

export default SensorDataRepository;