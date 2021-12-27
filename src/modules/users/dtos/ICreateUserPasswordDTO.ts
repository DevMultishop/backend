export default interface ICreateUserPasswordDTO {
  user_id: string;
  password_hash: string;
  type: 'login' | 'financial';
}
