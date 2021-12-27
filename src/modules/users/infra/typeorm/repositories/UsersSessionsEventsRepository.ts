import { getRepository } from 'typeorm';
import UserSessionEvent from '../entities/UserSessionEvent';
import IUsersSessionsEventsRepository from '../../../repositories/IUsersSessionsEventsRepository';

class UsersSessionsEventsRepository implements IUsersSessionsEventsRepository {
  constructor(private ormRepository = getRepository(UserSessionEvent)) {}

  public async create(
    user_id: string,
    token: string,
  ): Promise<UserSessionEvent> {
    const session = this.ormRepository.create({ user_id, token });
    await this.ormRepository.save(session);
    return session;
  }
}
export default UsersSessionsEventsRepository;
