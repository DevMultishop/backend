import { v4 } from 'uuid';
import ICreateEmailVerificationEventDTO from '../../dtos/ICreateEmailVerificationEventDTO';
import EmailVerificationEvent from '../../infra/typeorm/entities/EmailVerificationEvent';
import IEmailsVerificationEventsRepository from '../IEmailsVerificationEventsRepository';

class FakeEmailsVerificationEventsRepository
  implements IEmailsVerificationEventsRepository
{
  private verifications: EmailVerificationEvent[] = [];

  public async create({
    indicator_id,
    full_name,
    email,
  }: ICreateEmailVerificationEventDTO): Promise<EmailVerificationEvent> {
    const verification = new EmailVerificationEvent();
    Object.assign(verification, {
      indicator_id,
      full_name,
      email,
      id: v4(),
      created_at: new Date(),
    });
    this.verifications.push(verification);
    return verification;
  }

  public async findById(
    id: string,
  ): Promise<EmailVerificationEvent | undefined> {
    return this.verifications.find(v => v.id === id);
  }

  public async findByEmail(
    email: string,
  ): Promise<EmailVerificationEvent | undefined> {
    return this.verifications.find(v => v.email === email);
  }
}
export default FakeEmailsVerificationEventsRepository;
