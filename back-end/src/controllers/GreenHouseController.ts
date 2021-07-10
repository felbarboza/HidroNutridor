import { Request, Response } from 'express';
import CreateGreenHouseService from '../services/CreateGreenHouseService';
import ListGreenHousesService from '../services/ListGreenHousesService';

export default class SessionsController {
	public async create(
		request: Request,
		response: Response,
	): Promise<Response> {
		const { name } = request.body;

		const createGreenHouse = new CreateGreenHouseService;

		const greenHouse = await createGreenHouse.execute({name});

		return response.json({ greenHouse });
	}

  public async index(
		request: Request,
		response: Response,
	): Promise<Response> {
		const listGreenHouses = new ListGreenHousesService;

		const greenHouses = await listGreenHouses.execute();

		return response.json({ greenHouses });
	}
}