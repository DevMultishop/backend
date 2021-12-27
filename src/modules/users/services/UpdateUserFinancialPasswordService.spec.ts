import { addMinutes } from 'date-fns';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUsersPasswordsRepository from '../repositories/fakes/FakeUsersPasswordsRepository';
import FakeFinancialPasswordsEventsRepository from '../repositories/fakes/FakeFinancialPasswordsEventsRepository';
import FakeHashProvider from '../../../shared/container/providers/HashProvider/fakes/FakeHashProvider';
import UpdateUserFinancialPasswordService from './UpdateUserFinancialPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUsersPasswordsRepository: FakeUsersPasswordsRepository;
let fakeFinancialPasswordsEventsRepository: FakeFinancialPasswordsEventsRepository;
let fakeHashProvider: FakeHashProvider;
let updateUserFinancialPasswordService: UpdateUserFinancialPasswordService;

describe('UpdateUserFinancialPasswordService tests', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    fakeUsersPasswordsRepository = new FakeUsersPasswordsRepository();

    fakeFinancialPasswordsEventsRepository =
      new FakeFinancialPasswordsEventsRepository();

    fakeHashProvider = new FakeHashProvider();

    updateUserFinancialPasswordService = new UpdateUserFinancialPasswordService(
      fakeUsersRepository,
      fakeUsersPasswordsRepository,

      fakeFinancialPasswordsEventsRepository,
      fakeHashProvider,
    );
  });
  it('should throw a error about code not found', async () => {
    await expect(
      updateUserFinancialPasswordService.execute(
        'user_id',
        'code',
        'new_password',
      ),
    ).rejects.toHaveProperty('message', 'Codigo nao encontrado');
  });
  it('should throw a error about user not found', async () => {
    const event = await fakeFinancialPasswordsEventsRepository.create(
      'test@email.com',
    );
    await expect(
      updateUserFinancialPasswordService.execute(
        'user_id',
        event.id,
        'new_password',
      ),
    ).rejects.toHaveProperty('message', 'Usuario nao encontrado');
  });
  it('should throw a error about outdated code', async () => {
    const user = await fakeUsersRepository.create({
      email: 'test@email.com',
      full_name: 'test',
      phone_number: 'test',
      username: 'test',
    });
    const event = await fakeFinancialPasswordsEventsRepository.create(
      'test@email.com',
    );
    const userPass = await fakeUsersPasswordsRepository.create({
      password_hash: 'pass',
      type: 'financial',
      user_id: user.id,
    });
    userPass.updated_at = addMinutes(new Date(), 1);
    await fakeUsersPasswordsRepository.save(userPass);
    await expect(
      updateUserFinancialPasswordService.execute(
        user.id,
        event.id,
        'new_password',
      ),
    ).rejects.toHaveProperty(
      'message',
      'Codigo ja foi utilizado, solicite outro',
    );
  });
  it('should create a user financial password and return a sucess message', async () => {
    const user = await fakeUsersRepository.create({
      email: 'test@email.com',
      full_name: 'test',
      phone_number: 'test',
      username: 'test',
    });
    const event = await fakeFinancialPasswordsEventsRepository.create(
      'test@email.com',
    );

    await expect(
      updateUserFinancialPasswordService.execute(
        user.id,
        event.id,
        'new_password',
      ),
    ).resolves.toBe('Senha alterada com sucesso');
  });
  it('should update a user financial password and return a sucess message', async () => {
    const user = await fakeUsersRepository.create({
      email: 'test@email.com',
      full_name: 'test',
      phone_number: 'test',
      username: 'test',
    });
    await fakeUsersPasswordsRepository.create({
      password_hash: 'pass',
      type: 'financial',
      user_id: user.id,
    });
    const event = await fakeFinancialPasswordsEventsRepository.create(
      'test@email.com',
    );

    await expect(
      updateUserFinancialPasswordService.execute(
        user.id,
        event.id,
        'new_password',
      ),
    ).resolves.toBe('Senha alterada com sucesso');
  });
});
