import { container } from 'tsyringe';
import { Resolver, UseMiddleware, Query, Ctx, Arg } from 'type-graphql';
import GetProgressChartService from '../../../../plans/services/GetProgressChartService';
import EnsureIsUser from '../middlewares/EnsureIsUser';
import GetUserStatmentByMonthService from '../../../../balances/services/GetUserStatmentByMonthService';

interface IGainsMapped {
  [key: string]: {
    [key: string]: number;
  };
}

interface IGetGainsChartByMonthResult {
  [key: string]: string;
}

@Resolver()
class ChartsResolver {
  @Query(() => String)
  @UseMiddleware(EnsureIsUser)
  async getIncomeChart(): Promise<string> {
    // fill me in ...
    return JSON.stringify([]);
  }

  @Query(() => String)
  @UseMiddleware(EnsureIsUser)
  async getMyProgressChart(@Ctx('user_id') user_id: string): Promise<string> {
    return container.resolve(GetProgressChartService).execute({ user_id });
  }

  @Query(() => String)
  @UseMiddleware(EnsureIsUser)
  async getMyGainsChart(
    @Ctx('user_id') user_id: string,
    @Arg('month') month: number,
    @Arg('year') year: number,
  ): Promise<string> {
    const statment = await container
      .resolve(GetUserStatmentByMonthService)
      .execute({ month, year, user_id, card: 'available' });

    const gains = statment.filter(s => s.usd_cents > 0);

    const mapped = gains.reduce((acc, curr) => {
      if (!acc[curr.formatted_date_month]) acc[curr.formatted_date_month] = {};
      if (!acc[curr.formatted_date_month][curr.formatted_description])
        acc[curr.formatted_date_month][curr.formatted_description] = 0.0;
      acc[curr.formatted_date_month][curr.formatted_description] +=
        Number(curr.usd_cents) * 0.01;
      return acc;
    }, {} as IGainsMapped);

    return JSON.stringify(
      Object.keys(mapped).reduce((acc, key) => {
        acc.push({ ...mapped[key], date: key });
        return acc;
      }, [] as IGetGainsChartByMonthResult[]),
    );
  }
}
export default ChartsResolver;
