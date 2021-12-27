import { inject, injectable } from 'tsyringe';
import BigNumber from 'bignumber.js';
import IPlansDailyIncomesRepository from '../repositories/IPlansDailyIncomesRepository';
import PlanDailyIncome from '../infra/typeorm/entities/PlanDailyIncome';

@injectable()
class UpdateDailyIncomeService {
  constructor(
    @inject('PlansDailyIncomesRepository')
    private plansDailyIncomesRepository: IPlansDailyIncomesRepository,
  ) {}

  async execute(id: string, value: string): Promise<PlanDailyIncome> {
    const income = await this.plansDailyIncomesRepository.findById(id);
    if (!income) throw new Error('Not found');

    if (income.applied) throw new Error('Already applied');

    income.value = new BigNumber(value).toFixed(4);

    return this.plansDailyIncomesRepository.save(income);
  }
}
export default UpdateDailyIncomeService;
