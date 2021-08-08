import ActivationTime from 'infra/typeorm/entities/ActivationTime';
import { getRepository } from 'typeorm';

class DeleteActivationTimeService {
	public async execute(id: string): Promise<void> {
        const activatePumpRepository = getRepository(ActivationTime)

        const activatePump = await activatePumpRepository.findOne({
            where:{
                id
            }
        });

        if(activatePump){
            await activatePumpRepository.delete(activatePump)
        }

        return;
	}
}

export default DeleteActivationTimeService;