import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeFinancialPasswordsEventsRepository from '../repositories/fakes/FakeFinancialPasswordsEventsRepository';
import FakeMailProvider from '../../../shared/container/providers/MailProvider/fakes/FakeMailProvider';
import CreateFinancialPasswordEventService from './CreateFinancialPasswordEventService';

let fakeUsersRepository: FakeUsersRepository;
let fakeFinancialPasswordsEventsRepository: FakeFinancialPasswordsEventsRepository;
let fakeMailProvider: FakeMailProvider;
let createFinancialPasswordEventService: CreateFinancialPasswordEventService;

describe('CreateFinancialPasswordEventService tests', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    fakeFinancialPasswordsEventsRepository =
      new FakeFinancialPasswordsEventsRepository();

    fakeMailProvider = new FakeMailProvider();

    createFinancialPasswordEventService =
      new CreateFinancialPasswordEventService(
        fakeUsersRepository,
        fakeFinancialPasswordsEventsRepository,
        fakeMailProvider,
      );
  });
  it('should throw an error user not found', async () => {
    await expect(
      createFinancialPasswordEventService.execute('user_id'),
    ).rejects.toHaveProperty('message', 'Usuario nao encontrado');
  });

  it('should return a success message', async () => {
    const user = await fakeUsersRepository.create({
      email: 'test@email.com',
      full_name: 'test',
      phone_number: 'test',
      username: 'test',
    });
    await expect(
      createFinancialPasswordEventService.execute(user.id),
    ).resolves.toBe(
      'Acesse seu e-mail e copie o codigo de verificacao para continuar',
    );
  });
});
