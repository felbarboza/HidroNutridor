import { getRepository, Repository } from 'typeorm';
import ActivationTime from '../infra/typeorm/entities/ActivationTime';

interface ActivateTimeDTO{
    estufa_id: number;
    hour_time_on: number;
    minute_time_on: number;
    hour_time_off: number;
    minute_time_off: number;
}

class ActivationTimeRepository {
	private ormRepository: Repository<ActivationTime>;

	constructor() {
		this.ormRepository = getRepository(ActivationTime);
	}

	public async findByGreenHouseID(id: string): Promise<ActivationTime[]> {
		const activationTime = await this.ormRepository.find({
             where:{greenhouse_id: id}
         });

		return activationTime;
	}

	public async create(activationTime: ActivateTimeDTO): Promise<ActivationTime> {
		const newSensorData = this.ormRepository.create(activationTime);

		await this.ormRepository.save(newSensorData);

		return newSensorData;
	}

	public async save(activationTime: ActivationTime): Promise<ActivationTime> {
		return this.ormRepository.save(activationTime);
	}
}

export default ActivationTimeRepository;