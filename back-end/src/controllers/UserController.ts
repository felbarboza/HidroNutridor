import { Request, Response } from 'express';
import CreateUserService from '../services/CreateUserService';

export default class SessionsController {
	public async create(
		request: Request,
		response: Response,
	): Promise<Response> {
		const { name, login, password } = request.body;

		const createUser = new CreateUserService;

		const user = await createUser.execute({
			name,
      login,
			password,
		});

		return response.json({ user });
	}
}