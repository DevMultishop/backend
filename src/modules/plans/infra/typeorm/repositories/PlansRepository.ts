import { getRepository } from 'typeorm';
import IPlansRepository from '../../../repositories/IPlansRepository';
import Plan from '../entities/Plan';

class PlansRepository implements IPlansRepository {
  constructor(private ormRepository = getRepository(Plan)) {}

  public async find(): Promise<Plan[]> {
    return this.ormRepository.find({ order: { usd_cents: 'ASC' } });
  }

  public async findById(plan_id: string): Promise<Plan | undefined> {
    return this.ormRepository.findOne(plan_id);
  }
}

export default PlansRepository;
