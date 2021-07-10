import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import GreenHouse from '../infra/typeorm/entities/GreenHouse';


class ListGreenHousesService {
	public async execute(): Promise<GreenHouse[]> {
    const greenHouseRepository = getRepository(GreenHouse)

    const greenHouses = greenHouseRepository.find();
		
		return greenHouses;
	}
}

export default ListGreenHousesService;