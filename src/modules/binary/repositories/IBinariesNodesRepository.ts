import ICreateBinaryNodeDTO from '../dtos/ICreateBinaryNodeDTO';
import IFindByHigherAndPositionDTO from '../dtos/IFindByHigherAndPositionDTO';
import IFindConnectedNodesByUserIdDTO from '../dtos/IFindConnectedNodesByUserIdDTO';
import BinaryNode from '../infra/typeorm/entities/BinaryNode';

export default interface IBinariesNodesRepository {
  create(data: ICreateBinaryNodeDTO): Promise<BinaryNode>;
  findByUserId(user_id: string): Promise<BinaryNode | undefined>;
  findConnectedNodesByUserId(
    user_id: string,
  ): Promise<IFindConnectedNodesByUserIdDTO>;
  findByHigherAndPosition(
    data: IFindByHigherAndPositionDTO,
  ): Promise<BinaryNode | undefined>;
  findAll(): Promise<BinaryNode[]>;
}
