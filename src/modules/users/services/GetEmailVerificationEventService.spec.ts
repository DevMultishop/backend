import FakeEmailsVerificationEventsRepository from '../repositories/fakes/FakeEmailsVerificationEventsRepository';
import GetEmailVerificationEventService from './GetEmailVerificationEventService';

let fakeEmailsVerificationEventsRepository: FakeEmailsVerificationEventsRepository;
let getEmailVerificationEventService: GetEmailVerificationEventService;
describe('GetIndicatorService tests', () => {
  beforeEach(() => {
    fakeEmailsVerificationEventsRepository =
      new FakeEmailsVerificationEventsRepository();
    getEmailVerificationEventService = new GetEmailVerificationEventService(
      fakeEmailsVerificationEventsRepository,
    );
  });
  it('should throw an error', async () => {
    await expect(
      getEmailVerificationEventService.execute('id'),
    ).rejects.toHaveProperty('message', 'Codigo invalido');
  });
  it('should return an user', async () => {
    const { id } = await fakeEmailsVerificationEventsRepository.create({
      email: 'test',
      full_name: 'test',
      indicator_id: '1',
    });
    await expect(
      getEmailVerificationEventService.execute(id),
    ).resolves.toHaveProperty('id', id);
  });
});
