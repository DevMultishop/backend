export default interface ICreateUserBinaryPointsDTO {
  user_id: string;
  position: 'left' | 'right';
  points: number;
  from_user_id: string;
}
