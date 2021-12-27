import FinancialPasswordEvent from '../infra/typeorm/entities/FinancialPasswordEvent';

export default interface IFinancialPasswordsEventsRepository {
  create(email: string): Promise<FinancialPasswordEvent>;
  findById(id: string): Promise<FinancialPasswordEvent | undefined>;
  findByEmail(email: string): Promise<FinancialPasswordEvent | undefined>;
}
