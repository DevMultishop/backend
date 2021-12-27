import { inject, injectable } from 'tsyringe';
import Plan from '../infra/typeorm/entities/Plan';
import IPlansRepository from '../repositories/IPlansRepository';

@injectable()
class GetAllPlansService {
  constructor(
    @inject('PlansRepository')
    private plansRepository: IPlansRepository,
  ) {}

  public async execute(): Promise<Plan[]> {
    return this.plansRepository.find();
  }
}
export default GetAllPlansService;
