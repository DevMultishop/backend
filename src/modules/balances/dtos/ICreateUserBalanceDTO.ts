export default interface ICreateUserBalanceDTO {
  user_id: string;
  card: 'credit' | 'available' | 'income' | 'applied';
}
