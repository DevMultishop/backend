import ICreateEmailVerificationEventDTO from '../dtos/ICreateEmailVerificationEventDTO';
import EmailVerificationEvent from '../infra/typeorm/entities/EmailVerificationEvent';

export default interface IEmailsVerificationEventsRepository {
  create(
    data: ICreateEmailVerificationEventDTO,
  ): Promise<EmailVerificationEvent>;
  findById(id: string): Promise<EmailVerificationEvent | undefined>;
  findByEmail(email: string): Promise<EmailVerificationEvent | undefined>;
}
