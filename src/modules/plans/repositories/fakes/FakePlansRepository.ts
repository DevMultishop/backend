import Plan from '../../infra/typeorm/entities/Plan';
import IPlansRepository from '../IPlansRepository';

class FakePlansRepository implements IPlansRepository {
  private plans: Plan[] = [
    {
      id: '1',
      name: 'Teste',
      usd_cents: 10000,
      created_at: new Date(),
      formatted_usd_value: '1000',
    },
  ];

  public async find(): Promise<Plan[]> {
    return this.plans;
  }

  public async findById(plan_id: string): Promise<Plan | undefined> {
    return this.plans.find(p => p.id === plan_id);
  }
}

export default FakePlansRepository;
