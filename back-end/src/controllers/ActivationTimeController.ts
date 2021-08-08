import { Request, Response } from 'express';
import DeleteActivationTimeService from 'services/DeleteActivationTimeService';
import ListActivationTimeService from 'services/ListActivationTimeService';
import SaveActivatePumpService from '../services/SaveActivatePumpService';

export default class ActivationTimeController {
	public async create(
		request: Request,
		response: Response,
	): Promise<Response> {
		const { estufa_id, hour_time_on, minute_time_on, hour_time_off, minute_time_off } = request.body;

		const saveActivationTime = new SaveActivatePumpService;

		const activationTime = await saveActivationTime.execute({
			estufa_id, hour_time_on, minute_time_on, hour_time_off, minute_time_off
		});

		return response.json({ activationTime });
	}

    public async index(
		request: Request,
		response: Response,
	): Promise<Response> {
		const {estufa_id} = request.query

		const listActivationTime = new ListActivationTimeService;

		const activationsTime = await listActivationTime.execute(String(estufa_id));

		return response.json({ activationsTime });
	}

    public async delete(
		request: Request,
		response: Response,
	): Promise<Response> {
		const {id} = request.query
        
		const listActivationTime = new DeleteActivationTimeService;

		await listActivationTime.execute(String(id));

		return response.json();
	}
}