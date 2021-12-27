import { inject, injectable } from 'tsyringe';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IParams {
  user_id: string;
  full_name: string;
  phone_number: string;
}
@injectable()
class UpdateUserProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    user_id,
    full_name,
    phone_number,
  }: IParams): Promise<User> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) throw new Error('User not found');

    user.full_name = full_name;
    user.phone_number = phone_number;

    await this.usersRepository.save(user);

    return user;
  }
}
export default UpdateUserProfileService;
