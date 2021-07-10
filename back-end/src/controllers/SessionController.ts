import { Request, Response } from 'express';
import AuthenticateUserService from '../services/AuthenticateUserService';

export default class SessionsController {
	public async create(
		request: Request,
		response: Response,
	): Promise<Response> {
		const { login, password } = request.body;

		const authenticateUser = new AuthenticateUserService;

		const { user, token } = await authenticateUser.execute({
			login,
			password,
		});

		return response.json({ user, token });
	}
}