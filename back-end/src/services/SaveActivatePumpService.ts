import ActivationTime from 'infra/typeorm/entities/ActivationTime';
import { getRepository } from 'typeorm';

interface ActivateTimeDTO{
    estufa_id: number;
    hour_time_on: number;
    minute_time_on: number;
    hour_time_off: number;
    minute_time_off: number;
}

class ActivatePumpService {
	public async execute({estufa_id, hour_time_on, minute_time_on, hour_time_off, minute_time_off}: ActivateTimeDTO): Promise<ActivationTime> {
        const activatePumpRepository = getRepository(ActivationTime)
        
        const activatePump = activatePumpRepository.create({
            greenhouse_id: estufa_id,
            hour_time_on,
            minute_time_on,
            hour_time_off,
            minute_time_off,
        });
        console.log(activatePump)

        await activatePumpRepository.save(activatePump)
        console.log(activatePump)
        return activatePump;
	}
}

export default ActivatePumpService;