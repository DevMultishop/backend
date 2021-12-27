export default interface ICreateUserBitcoinDepositEventDTO {
  user_id: string;
  address: string;
  usd_cents: number;
  satoshis: number;
  btc_usd_conversion: number;
}
