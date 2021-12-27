import { addMinutes } from 'date-fns';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUsersPasswordsRepository from '../repositories/fakes/FakeUsersPasswordsRepository';
import FakePasswordsForgotEventsRepository from '../repositories/fakes/FakePasswordsForgotEventsRepository';
import FakeHashProvider from '../../../shared/container/providers/HashProvider/fakes/FakeHashProvider';
import ResetLoginPasswordService from './ResetLoginPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUsersPasswordsRepository: FakeUsersPasswordsRepository;
let fakePasswordsForgotEventsRepository: FakePasswordsForgotEventsRepository;
let fakeHashProvider: FakeHashProvider;
let resetLoginPasswordService: ResetLoginPasswordService;

describe('ResetLoginPasswordService tests', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    fakeUsersPasswordsRepository = new FakeUsersPasswordsRepository();

    fakePasswordsForgotEventsRepository =
      new FakePasswordsForgotEventsRepository();

    fakeHashProvider = new FakeHashProvider();

    resetLoginPasswordService = new ResetLoginPasswordService(
      fakeUsersRepository,
      fakeUsersPasswordsRepository,
      fakePasswordsForgotEventsRepository,
      fakeHashProvider,
    );
  });
  it('should throw an error about invalid code', async () => {
    await expect(
      resetLoginPasswordService.execute('123', 'new_password'),
    ).rejects.toHaveProperty('message', 'Codigo nao encontrado');
  });

  it('should throw an error about invalid email', async () => {
    const event = await fakePasswordsForgotEventsRepository.create(
      'test@email.com',
    );
    await expect(
      resetLoginPasswordService.execute(event.id, 'new_password'),
    ).rejects.toHaveProperty('message', 'E-mail nao encontrado');
  });
  it('should throw an error about user not having a password', async () => {
    await fakeUsersRepository.create({
      email: 'test@email.com',
      full_name: 'test',
      phone_number: 'test',
      username: 'test',
    });
    const event = await fakePasswordsForgotEventsRepository.create(
      'test@email.com',
    );
    await expect(
      resetLoginPasswordService.execute(event.id, 'new_password'),
    ).rejects.toHaveProperty('message', 'Senha de usuario nao encontrado');
  });
  it('should throw an error about not valid code', async () => {
    const user = await fakeUsersRepository.create({
      email: 'test@email.com',
      full_name: 'test',
      phone_number: 'test',
      username: 'test',
    });
    const userPass = await fakeUsersPasswordsRepository.create({
      password_hash: '1234',
      type: 'login',
      user_id: user.id,
    });
    const event = await fakePasswordsForgotEventsRepository.create(
      'test@email.com',
    );
    userPass.updated_at = addMinutes(event.created_at, 1);
    await fakeUsersPasswordsRepository.save(userPass);
    await expect(
      resetLoginPasswordService.execute(event.id, 'new_password'),
    ).rejects.toHaveProperty(
      'message',
      'Codigo ja foi utilizado, solicite outro',
    );
  });
  it('should return a sucess message', async () => {
    const user = await fakeUsersRepository.create({
      email: 'test@email.com',
      full_name: 'test',
      phone_number: 'test',
      username: 'test',
    });
    await fakeUsersPasswordsRepository.create({
      password_hash: '1234',
      type: 'login',
      user_id: user.id,
    });
    const event = await fakePasswordsForgotEventsRepository.create(
      'test@email.com',
    );

    await expect(
      resetLoginPasswordService.execute(event.id, 'new_password'),
    ).resolves.toBe('Senha alterada com sucesso');
  });
});
