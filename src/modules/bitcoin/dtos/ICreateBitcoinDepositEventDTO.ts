export default interface ICreateBitcoinDepositEventDTO {
  address: string;
  txid: string;
  satoshis: number;
  usd_cents: number;
  btc_usd_conversion: number;
  status: 'pending' | 'confirmed';
}
