import PasswordForgotEvent from '../infra/typeorm/entities/PasswordForgotEvent';

export default interface IPasswordsForgotEventsRepository {
  create(email: string): Promise<PasswordForgotEvent>;
  findById(id: string): Promise<PasswordForgotEvent | undefined>;
}
