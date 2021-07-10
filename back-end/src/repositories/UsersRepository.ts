import { getRepository, Repository } from 'typeorm';
import User from '../infra/typeorm/entities/User';

interface CreateUserDTO{
  name: string;
  login: string;
  password: string;
}


class UsersRepository {
	private ormRepository: Repository<User>;

	constructor() {
		this.ormRepository = getRepository(User);
	}

	public async findByEmail(login: string): Promise<User | undefined> {
		const user = await this.ormRepository.findOne({
			where: { login },
		});

		return user;
	}

  public async create(userData: CreateUserDTO): Promise<User> {
		const user = this.ormRepository.create(userData);

		await this.ormRepository.save(user);

		return user;
	}

}

export default UsersRepository;