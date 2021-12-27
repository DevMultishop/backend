export default interface ICreateBinaryNodeDTO {
  user_id: string;
  higher_id: string;
  position: 'left' | 'right';
  depth: number;
}
