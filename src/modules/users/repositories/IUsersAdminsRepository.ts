import UserAdmin from '../infra/typeorm/entities/UserAdmin';

export default interface IUsersAdminsRepository {
  findByUserId(user_id: string): Promise<UserAdmin | undefined>;
}
