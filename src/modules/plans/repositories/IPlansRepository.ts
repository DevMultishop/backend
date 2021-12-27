import Plan from '../infra/typeorm/entities/Plan';

export default interface IPlansRepository {
  find(): Promise<Plan[]>;
  findById(plan_id: string): Promise<Plan | undefined>;
}
