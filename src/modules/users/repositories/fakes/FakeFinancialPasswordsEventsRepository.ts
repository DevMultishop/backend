import { v4 } from 'uuid';
import FinancialPasswordEvent from '../../infra/typeorm/entities/FinancialPasswordEvent';
import IFinancialPasswordsEventsRepository from '../IFinancialPasswordsEventsRepository';

class FakeFinancialPasswordsEventsRepository
  implements IFinancialPasswordsEventsRepository
{
  private events: FinancialPasswordEvent[] = [];

  public async create(email: string): Promise<FinancialPasswordEvent> {
    const event = new FinancialPasswordEvent();
    Object.assign(event, {
      email,
      id: v4(),
      created_at: new Date(),
    });

    this.events.push(event);
    return event;
  }

  public async findById(
    id: string,
  ): Promise<FinancialPasswordEvent | undefined> {
    return this.events.find(e => e.id === id);
  }

  public async findByEmail(
    email: string,
  ): Promise<FinancialPasswordEvent | undefined> {
    return this.events.find(e => e.email === email);
  }
}
export default FakeFinancialPasswordsEventsRepository;
