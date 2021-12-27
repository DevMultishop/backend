import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeEmailsVerificationEventsRepository from '../repositories/fakes/FakeEmailsVerificationEventsRepository';
import CreateEmailVerificationEventService from './CreateEmailVerificationEventService';
import FakeMailProvider from '../../../shared/container/providers/MailProvider/fakes/FakeMailProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeEmailsVerificationEventsRepository: FakeEmailsVerificationEventsRepository;
let createEmailVerificationEventService: CreateEmailVerificationEventService;
let fakeMailProvider: FakeMailProvider;

describe('CreateEmailVerificationEventService tests', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeEmailsVerificationEventsRepository =
      new FakeEmailsVerificationEventsRepository();
    createEmailVerificationEventService =
      new CreateEmailVerificationEventService(
        fakeUsersRepository,
        fakeEmailsVerificationEventsRepository,
        fakeMailProvider,
      );
  });
  it('should throw an error', async () => {
    await fakeUsersRepository.create({
      email: 'test@email.com',
      full_name: 'test',
      phone_number: 'test',
      username: 'test',
    });
    await expect(
      createEmailVerificationEventService.execute({
        email: 'test@email.com',
        full_name: 'test',
        indicator_id: '1',
      }),
    ).rejects.toHaveProperty('message', 'E-mail ja cadastrado');
  });

  it('should return a success message', async () => {
    await expect(
      createEmailVerificationEventService.execute({
        email: 'test@email.com',
        full_name: 'test',
        indicator_id: '1',
      }),
    ).resolves.toBe(
      'Acesse seu e-mail e copie o codigo de verificacao para continuar com o cadastro',
    );
  });
});
