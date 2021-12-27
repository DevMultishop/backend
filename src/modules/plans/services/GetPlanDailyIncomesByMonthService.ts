import { inject, injectable } from 'tsyringe';
import {
  format,
  getDaysInMonth,
  isAfter,
  isEqual,
  startOfMonth,
} from 'date-fns';
import PlanDailyIncome from '../infra/typeorm/entities/PlanDailyIncome';
import IPlansDailyIncomesRepository from '../repositories/IPlansDailyIncomesRepository';

interface IParams {
  year: number;
  month: number;
}

@injectable()
class GetPlanDailyIncomesByMonthService {
  constructor(
    @inject('PlansDailyIncomesRepository')
    private plansDailyIncomesRepository: IPlansDailyIncomesRepository,
  ) {}

  async execute({ month, year }: IParams): Promise<PlanDailyIncome[]> {
    let incomes = await this.plansDailyIncomesRepository.findAllByMonth(
      month,
      year,
    );

    if (incomes.length === 0) {
      const now = new Date();
      const monthDate = new Date(year, month);
      if (isAfter(startOfMonth(now), startOfMonth(monthDate))) return [];

      const today = isEqual(startOfMonth(now), startOfMonth(monthDate))
        ? now.getDate()
        : 1;

      const daysCount = getDaysInMonth(new Date(year, month));
      const promisses = new Array(daysCount - today + 1)
        .fill(0)
        .map((_, index) => {
          const date = new Date(year, month, index + today);
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;
          // if (isWeekend) return null;
          return {
            month,
            year: isWeekend ? -1 : year,
            day: index + today,
            value: '0.00',
            date_formatted: format(date, 'yyyy-MM-dd'),
          };
        })
        .filter(item => item.year > -1)
        .map(data =>
          this.plansDailyIncomesRepository.create(
            data.day,
            data.month,
            data.year,
            data.value,
            data.date_formatted,
          ),
        );

      incomes = await Promise.all(promisses);
    }

    return incomes;
  }
}
export default GetPlanDailyIncomesByMonthService;
