import { getRepository, Repository } from 'typeorm';
import GreenHouse from '../infra/typeorm/entities/GreenHouse';

class GreenHouseRepository {
	private ormRepository: Repository<GreenHouse>;

	constructor() {
		this.ormRepository = getRepository(GreenHouse);
	}

	public async findById(id: string): Promise<GreenHouse | undefined> {
		const greenHouse = await this.ormRepository.findOne(id);

		return greenHouse;
	}

	public async findAll(): Promise<GreenHouse[]> {
		
    const greenHouses = await this.ormRepository.find();

		return greenHouses;
	}

	public async create(name: string): Promise<GreenHouse> {
    const data={
      name
    }

		const greenHouse = this.ormRepository.create(data);

		await this.ormRepository.save(greenHouse);

		return greenHouse;
	}

	public async save(greenHouse: GreenHouse): Promise<GreenHouse> {
		return this.ormRepository.save(greenHouse);
	}
}

export default GreenHouseRepository;