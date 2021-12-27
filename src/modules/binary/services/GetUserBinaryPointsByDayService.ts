import { inject, injectable } from 'tsyringe';

import UserBinaryPoint from '../infra/typeorm/entities/UserBinaryPoint';
import IUsersBinaryPointsRepository from '../repositories/IUsersBinaryPointsRepository';

interface IParams {
  user_id: string;
  day: Date;
}

@injectable()
class GetUsersBinaryPointsService {
  constructor(
    @inject('UsersBinaryPointsRepository')
    private usersBinaryPointsRepository: IUsersBinaryPointsRepository,
  ) {}

  public async execute({ user_id, day }: IParams): Promise<UserBinaryPoint[]> {
    return this.usersBinaryPointsRepository.findByUserIdAndDay(user_id, day);
  }
}
export default GetUsersBinaryPointsService;
