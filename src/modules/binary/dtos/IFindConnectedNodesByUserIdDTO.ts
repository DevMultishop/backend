import BinaryNode from '../infra/typeorm/entities/BinaryNode';

export default interface IFindConnectedNodesByUserIdDTO {
  higher?: BinaryNode;
  node?: BinaryNode;
  left?: BinaryNode;
  right?: BinaryNode;
}
