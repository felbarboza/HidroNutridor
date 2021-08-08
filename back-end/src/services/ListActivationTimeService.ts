import ActivationTime from 'infra/typeorm/entities/ActivationTime';
import { getRepository } from 'typeorm';

class ListActivationTimeService {
	public async execute(estufa_id: string): Promise<ActivationTime[]> {
        const activatePumpRepository = getRepository(ActivationTime)

        const activatePumpHistory = activatePumpRepository.find({
            where:{
                greenhouse_id: estufa_id
            }
        });

        return activatePumpHistory;
	}
}

export default ListActivationTimeService;