import FakeUsersSessionsEventsRepository from '../repositories/fakes/FakeUsersSessionsEventsRepository';
import FakeUsersPasswordsRepository from '../repositories/fakes/FakeUsersPasswordsRepository';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserSessionService from './CreateUserSessionService';
import FakeHashProvider from '../../../shared/container/providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersSessionsEventsRepository: FakeUsersSessionsEventsRepository;
let fakeUsersPasswordsRepository: FakeUsersPasswordsRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUserSessionService: CreateUserSessionService;

describe('CreateUserSessionService tests', () => {
  beforeEach(() => {
    fakeUsersSessionsEventsRepository = new FakeUsersSessionsEventsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeUsersPasswordsRepository = new FakeUsersPasswordsRepository();
    createUserSessionService = new CreateUserSessionService(
      fakeUsersPasswordsRepository,
      fakeUsersSessionsEventsRepository,
      fakeUsersRepository,
      fakeHashProvider,
    );
  });
  it('should throw an error about wrong username', async () => {
    await expect(
      createUserSessionService.execute('username', '12345678'),
    ).rejects.toHaveProperty('message', 'E-mail ou senha incorretos');
  });
  it('should throw an error about not having password', async () => {
    await fakeUsersRepository.create({
      email: 'test',
      full_name: 'john',
      phone_number: 'test',
      username: 'username',
    });
    await expect(
      createUserSessionService.execute('test', '12345678'),
    ).rejects.toHaveProperty('message', 'Senha nao encontrada');
  });
  it('should throw an error about wrong password', async () => {
    const user = await fakeUsersRepository.create({
      email: 'test',
      full_name: 'john',
      phone_number: 'test',
      username: 'username',
    });
    await fakeUsersPasswordsRepository.create({
      password_hash: '123456789',
      type: 'login',
      user_id: user.id,
    });
    await expect(
      createUserSessionService.execute('test', '12345678'),
    ).rejects.toHaveProperty('message', 'E-mail ou senha incorretos');
  });
  it('should return a session event', async () => {
    const user = await fakeUsersRepository.create({
      email: 'test',
      full_name: 'john',
      phone_number: 'test',
      username: 'username',
    });
    await fakeUsersPasswordsRepository.create({
      password_hash: '12345678',
      type: 'login',
      user_id: user.id,
    });
    await expect(
      createUserSessionService.execute('test', '12345678'),
    ).resolves.toHaveProperty('token');
  });
});
