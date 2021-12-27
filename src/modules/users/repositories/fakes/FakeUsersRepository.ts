import { v4 } from 'uuid';
import User from '../../infra/typeorm/entities/User';
import IUsersRepository from '../IUsersRepository';
import ICreateUserDTO from '../../dtos/ICreateUserDTO';

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async findByUsername(username: string): Promise<User | undefined> {
    return this.users.find(u => u.username === username);
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(u => u.email === email);
  }

  public async findById(id: string): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }

  public async find(): Promise<User[]> {
    return this.users;
  }

  public async create({
    email,
    full_name,
    phone_number,
    username,
  }: ICreateUserDTO): Promise<User> {
    const user = new User();
    Object.assign(user, {
      id: v4(),
      email,
      full_name,
      phone_number,
      username,
      updated_at: new Date(),
    });
    this.users.push(user);
    return user;
  }

  public async save(user: User): Promise<User> {
    return user;
  }
}
export default FakeUsersRepository;
