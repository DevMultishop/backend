import { getRepository } from 'typeorm';
import ICreateUserDTO from '../../../dtos/ICreateUserDTO';
import IUsersRepository from '../../../repositories/IUsersRepository';
import User from '../entities/User';

class UsersRepository implements IUsersRepository {
  constructor(private ormRepository = getRepository(User)) {}

  public async findByUsername(username: string): Promise<User | undefined> {
    return this.ormRepository.findOne({ where: { username } });
  }

  public async find(): Promise<User[]> {
    return this.ormRepository.find({
      order: { email: 'ASC' },
    });
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return this.ormRepository.findOne({ where: { email } });
  }

  public async findById(id: string): Promise<User | undefined> {
    return this.ormRepository.findOne(id);
  }

  public async create({
    email,
    full_name,
    phone_number,
    username,
  }: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create({
      email,
      full_name,
      phone_number,
      username,
    });
    await this.ormRepository.save(user);
    return user;
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }
}
export default UsersRepository;
