import { v4 } from 'uuid';
import PasswordForgotEvent from '../../infra/typeorm/entities/PasswordForgotEvent';
import IPasswordsForgotEventsRepository from '../IPasswordsForgotEventsRepository';

class FakePasswordsForgotEventsRepository
  implements IPasswordsForgotEventsRepository
{
  private events: PasswordForgotEvent[] = [];

  public async create(email: string): Promise<PasswordForgotEvent> {
    const event = new PasswordForgotEvent();
    Object.assign(event, { email, id: v4(), created_at: new Date() });
    this.events.push(event);
    return event;
  }

  public async findById(id: string): Promise<PasswordForgotEvent | undefined> {
    return this.events.find(e => e.id === id);
  }
}

export default FakePasswordsForgotEventsRepository;
