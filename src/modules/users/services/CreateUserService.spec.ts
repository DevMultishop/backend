import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let createUserService: CreateUserService;

describe('CreateUserService tests', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    createUserService = new CreateUserService(fakeUsersRepository);
  });
  it('should throw an error about invalid e-mail', async () => {
    await fakeUsersRepository.create({
      email: 'test',
      full_name: 'test',
      phone_number: 'test',
      username: 'test',
    });

    await expect(
      createUserService.execute({
        email: 'test',
        full_name: 'test',
        phone_number: 'test',
        username: 'test',
      }),
    ).rejects.toHaveProperty('message', 'E-mail ja cadastrado');
  });
  it('should throw an error about invalid username', async () => {
    await fakeUsersRepository.create({
      email: 'test',
      full_name: 'test',
      phone_number: 'test',
      username: 'test',
    });

    await expect(
      createUserService.execute({
        email: 'test@email.com',
        full_name: 'test',
        phone_number: 'test',
        username: 'test',
      }),
    ).rejects.toHaveProperty('message', 'Username ja cadastrado');
  });
  it('should return an user', async () => {
    await expect(
      createUserService.execute({
        email: 'test@email.com',
        full_name: 'test',
        phone_number: 'test',
        username: 'test',
      }),
    ).resolves.toHaveProperty('id');
  });
});
