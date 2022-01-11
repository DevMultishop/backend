import ICreateUnilevelNodeDTO from '../dots/ICreateUnilevelNodeDTO';
import UnilevelNode from '../infra/typeorm/entities/UnilevelNode';

export default interface IUnilevelNodesRepository {
  create(data: ICreateUnilevelNodeDTO): Promise<UnilevelNode>;
  findByUserId(user_id: string): Promise<UnilevelNode | undefined>;
  findAllByIndicatorId(indicator_id: string): Promise<UnilevelNode[]>;
  findAllIndicateds(user_id: string): Promise<number>;
}
