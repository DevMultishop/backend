import { inject, injectable } from 'tsyringe';
import EmailVerificationEvent from '../infra/typeorm/entities/EmailVerificationEvent';
import IEmailsVerificationEventsRepository from '../repositories/IEmailsVerificationEventsRepository';

@injectable()
class GetEmailVerificationEventService {
  constructor(
    @inject('EmailsVerificationEventsRepository')
    private emailsVerificationEventsRepository: IEmailsVerificationEventsRepository,
  ) {}

  public async execute(id: string): Promise<EmailVerificationEvent> {
    const event = await this.emailsVerificationEventsRepository.findById(id);
    if (!event) throw new Error('invalid code');

    return event;
  }
}
export default GetEmailVerificationEventService;
