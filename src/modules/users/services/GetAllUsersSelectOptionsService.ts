import { inject, injectable } from 'tsyringe';
import UsersSelectOptions from '../infra/graphql/type/UsersSelectOptions';
import IUsersRepository from '../repositories/IUsersRepository';

@injectable()
class GetAllUsersSelectOptionsService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(): Promise<UsersSelectOptions[]> {
    const users = await this.usersRepository.find();
    return users.map(user => ({
      label: `${user.email} - ${user.full_name}`,
      value: user.id,
    }));
  }
}
export default GetAllUsersSelectOptionsService;
