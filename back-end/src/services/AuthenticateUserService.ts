import { sign } from 'jsonwebtoken';
import AppError from '../errors/AppError';
import authConfig from '../config/auth';
import User from '../infra/typeorm/entities/User';
import { getRepository } from 'typeorm';

interface IRequest {
	login: string;
	password: string;
}
interface IResponse {
	user: User;
	token: string;
}

class AuthenticateUserService {

	public async execute({ login, password }: IRequest): Promise<IResponse> {
    const usersRepository = getRepository(User)

		const user = await usersRepository.findOne({where:{login}});

		if (!user) {
			throw new AppError('Incorrect login/password combination', 401);
		}

    const passwordMatched = true ? password==user.password : false

		if (!passwordMatched) {
			throw new AppError('Incorrect login/password combination', 401);
		}

		const { secret, expiresIn } = authConfig.jwt;

		const token = sign({}, secret, {
			subject: user.id,
			expiresIn,
		});
    
		return {
			user,
			token,
		};
	}
}

export default AuthenticateUserService;