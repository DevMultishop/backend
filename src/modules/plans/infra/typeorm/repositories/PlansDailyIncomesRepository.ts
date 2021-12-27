import { getRepository } from 'typeorm';
import IPlansDailyIncomesRepository from '../../../repositories/IPlansDailyIncomesRepository';
import PlanDailyIncome from '../entities/PlanDailyIncome';

class PlansDailyIncomesRepository implements IPlansDailyIncomesRepository {
  constructor(private ormRepository = getRepository(PlanDailyIncome)) {}

  public async findById(id: string): Promise<PlanDailyIncome | undefined> {
    return this.ormRepository.findOne(id);
  }

  public async create(
    day: number,
    month: number,
    year: number,
    value: string,
    date_formatted: string,
  ): Promise<PlanDailyIncome> {
    const income = this.ormRepository.create({
      date_formatted,
      day,
      month,
      value,
      year,
      applied: false,
    });
    await this.ormRepository.save(income);
    return income;
  }

  public async findAllApplied(): Promise<PlanDailyIncome[]> {
    return this.ormRepository.find({
      where: { applied: true },
      order: { year: 'ASC', month: 'ASC', day: 'ASC' },
    });
  }

  public async save(plan: PlanDailyIncome): Promise<PlanDailyIncome> {
    return this.ormRepository.save(plan);
  }

  public async findAllByMonth(
    month: number,
    year: number,
  ): Promise<PlanDailyIncome[]> {
    const finded = await this.ormRepository.find({
      where: {
        year,
        month,
      },
      order: { year: 'ASC', month: 'ASC', day: 'ASC' },
    });
    return finded;
  }

  public async findByDay(
    day: number,
    month: number,
    year: number,
  ): Promise<PlanDailyIncome | undefined> {
    return this.ormRepository.findOne({
      where: {
        day,
        month,
        year,
      },
    });
  }
}
export default PlansDailyIncomesRepository;
