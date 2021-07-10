import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import User from '../infra/typeorm/entities/User';

interface CreateUserDTO{
  name: string;
  login: string;
  password: string;
}

class CreateUserService {
	public async execute({ name, login, password }: CreateUserDTO): Promise<User> {
    const usersRepository = getRepository(User)

    const user = usersRepository.create({
      name, login, password
    });

    usersRepository.save(user)
		
		return user;
	}
}

export default CreateUserService;