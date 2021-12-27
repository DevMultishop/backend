import { inject, injectable } from 'tsyringe';
import IUsersPlansRepository from '../repositories/IUsersPlansRepository';

interface IParams {
  user_id: string;
}

interface IResponse {
  limit: number;
  progress: number;
}

@injectable()
class GetProgressChartService {
  constructor(
    @inject('UsersPlansRepository')
    private usersPlansRepository: IUsersPlansRepository,
  ) {}

  public async execute({ user_id }: IParams): Promise<string> {
    const validPlans = await this.usersPlansRepository.findNotFilledByUserId(
      user_id,
    );

    const { limit, progress }: IResponse = validPlans.reduce(
      (acc, curr) => {
        acc.limit += Number(curr.limit_usd_cents) * 0.01;
        acc.progress += Number(curr.progress_usd_cents) * 0.01;

        return acc;
      },
      {
        limit: 0,
        progress: 0,
      },
    );

    return JSON.stringify({
      limit: 200,
      progress: limit > 0 ? (progress * 100) / (limit / 2) : 0,
    });
  }
}
export default GetProgressChartService;
