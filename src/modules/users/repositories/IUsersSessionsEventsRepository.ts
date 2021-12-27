import UserSessionEvent from '../infra/typeorm/entities/UserSessionEvent';

export default interface IUsersSessionsEventsRepository {
  create(user_id: string, token: string): Promise<UserSessionEvent>;
}
