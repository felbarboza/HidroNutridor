import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import GreenHouse from '../infra/typeorm/entities/GreenHouse';

interface CreateGreenHouseDTO{
  name: string;
}

class CreateGreenHouseService {
	public async execute({ name }: CreateGreenHouseDTO): Promise<GreenHouse> {
    const greenHouseRepository = getRepository(GreenHouse)

    const greenHouse = greenHouseRepository.create({name});

    greenHouseRepository.save(greenHouse)
		
		return greenHouse;
	}
}

export default CreateGreenHouseService;