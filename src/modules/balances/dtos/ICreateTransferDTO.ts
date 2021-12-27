export default interface ICreateTransferDTO {
  user_id: string;
  card: 'credit' | 'available' | 'income' | 'applied';
  usd_cents: number;
  description: string;
}
