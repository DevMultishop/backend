import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakePasswordsForgotEventsRepository from '../repositories/fakes/FakePasswordsForgotEventsRepository';
import CreatePasswordForgotEventService from './CreatePasswordForgotEventService';
import FakeMailProvider from '../../../shared/container/providers/MailProvider/fakes/FakeMailProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakePasswordsForgotEventsRepository: FakePasswordsForgotEventsRepository;
let createPasswordForgotEventService: CreatePasswordForgotEventService;
let fakeMailProvider: FakeMailProvider;

describe('CreatePasswordForgotEventService tests', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakePasswordsForgotEventsRepository =
      new FakePasswordsForgotEventsRepository();
    createPasswordForgotEventService = new CreatePasswordForgotEventService(
      fakeUsersRepository,
      fakePasswordsForgotEventsRepository,
      fakeMailProvider,
    );
  });
  it('should throw an error about email', async () => {
    await expect(
      createPasswordForgotEventService.execute('test@email.com'),
    ).rejects.toHaveProperty('message', 'E-mail nao encontrado');
  });

  it('should return a success message', async () => {
    await fakeUsersRepository.create({
      email: 'test@email.com',
      full_name: 'teste',
      phone_number: 'test',
      username: 'test',
    });
    await expect(
      createPasswordForgotEventService.execute('test@email.com'),
    ).resolves.toBe(
      'Acesse seu e-mail e copie o codigo de verificacao para alterar sua senha',
    );
  });
});
