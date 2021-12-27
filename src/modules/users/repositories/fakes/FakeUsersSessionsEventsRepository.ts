import { v4 } from 'uuid';
import UserSessionEvent from '../../infra/typeorm/entities/UserSessionEvent';
import IUsersSessionsEventsRepository from '../IUsersSessionsEventsRepository';

class FakeUsersSessionsEventsRepository
  implements IUsersSessionsEventsRepository
{
  private sessions: UserSessionEvent[] = [];

  public async create(
    user_id: string,
    token: string,
  ): Promise<UserSessionEvent> {
    const session = new UserSessionEvent();
    Object.assign(session, {
      user_id,
      token,
      id: v4(),
      created_at: new Date(),
    });
    this.sessions.push(session);
    return session;
  }
}
export default FakeUsersSessionsEventsRepository;
