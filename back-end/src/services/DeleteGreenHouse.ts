import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import GreenHouse from '../infra/typeorm/entities/GreenHouse';

class DeleteGreenHouseService {
	public async execute(estufa_id: number): Promise<void> {
        const greenHouseRepository = getRepository(GreenHouse)

        const greenHouse = await greenHouseRepository.findOne({
            where:{
                id: estufa_id
            }
        })
        if(greenHouse){
            await greenHouseRepository.delete(greenHouse)
        }
		
		return;
	}
}

export default DeleteGreenHouseService;