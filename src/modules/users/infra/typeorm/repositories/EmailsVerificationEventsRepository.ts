import { getRepository } from 'typeorm';
import ICreateEmailVerificationEventDTO from '../../../dtos/ICreateEmailVerificationEventDTO';
import EmailVerificationEvent from '../entities/EmailVerificationEvent';
import IEmailsVerificationEventsRepository from '../../../repositories/IEmailsVerificationEventsRepository';

class EmailsVerificationEventsRepository
  implements IEmailsVerificationEventsRepository
{
  constructor(private ormRepository = getRepository(EmailVerificationEvent)) {}

  public async create({
    indicator_id,
    full_name,
    email,
  }: ICreateEmailVerificationEventDTO): Promise<EmailVerificationEvent> {
    const event = this.ormRepository.create({
      indicator_id,
      full_name,
      email,
    });
    await this.ormRepository.save(event);
    return event;
  }

  public async findById(
    id: string,
  ): Promise<EmailVerificationEvent | undefined> {
    return this.ormRepository.findOne({ where: { id } });
  }

  public async findByEmail(
    email: string,
  ): Promise<EmailVerificationEvent | undefined> {
    return this.ormRepository.findOne({ where: { email } });
  }
}
export default EmailsVerificationEventsRepository;
