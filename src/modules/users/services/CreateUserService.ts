import { inject, injectable } from 'tsyringe';
import User from '../infra/typeorm/entities/User';

import IUsersRepository from '../repositories/IUsersRepository';

interface IParams {
  email: string;
  full_name: string;
  phone_number: string;
  username: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    username,
    phone_number,
    full_name,
    email,
  }: IParams): Promise<User> {
    /**
     * email deve ser unico
     */
    const emailExists = await this.usersRepository.findByEmail(email);
    if (emailExists) throw new Error('E-mail is unavailable');

    /**
     * username deve ser unico
     */
    const usernameExists = await this.usersRepository.findByUsername(username);
    if (usernameExists) throw new Error('Nickname is unavailable');

    const user = await this.usersRepository.create({
      email,
      full_name,
      phone_number,
      username,
    });

    return user;
  }
}
export default CreateUserService;
