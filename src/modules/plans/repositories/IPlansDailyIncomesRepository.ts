import PlanDailyIncome from '../infra/typeorm/entities/PlanDailyIncome';

export default interface IPlansDailyIncomesRepository {
  create(
    day: number,
    month: number,
    year: number,
    value: string,
    date_formatted: string,
  ): Promise<PlanDailyIncome>;

  findAllByMonth(month: number, year: number): Promise<PlanDailyIncome[]>;

  findAllApplied(): Promise<PlanDailyIncome[]>;

  findById(id: string): Promise<PlanDailyIncome | undefined>;

  findByDay(
    day: number,
    month: number,
    year: number,
  ): Promise<PlanDailyIncome | undefined>;

  save(plan: PlanDailyIncome): Promise<PlanDailyIncome>;
}
