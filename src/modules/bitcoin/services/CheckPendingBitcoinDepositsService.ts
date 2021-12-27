import { inject, injectable } from 'tsyringe';
// import { addMinutes, isBefore } from 'date-fns';
import IBitcoinDepositsEventsRepository from '../repositories/IBitcoinDepositsEventsRepository';
import ICryptoProvider from '../../../shared/container/providers/CryptoProvider/models/ICryptoProvider';
import BitcoinDepositEvent from '../infra/typeorm/entities/BitcoinDepositEvent';
// import IUsersBitcoinDepositsEventsRepository from '../repositories/IUsersBitcoinDepositsEventsRepository';

@injectable()
class CheckPendingBitcoinDepositsService {
  constructor(
    @inject('BitcoinDepositsEventsRepository')
    private bitcoinDepositsEventsRepository: IBitcoinDepositsEventsRepository,

    // @inject('UsersBitcoinDepositsEventsRepository')
    // private usersBitcoinDepositsEventsRepository: IUsersBitcoinDepositsEventsRepository,

    @inject('Bitcoin')
    private bitcoin: ICryptoProvider,
  ) {}

  public async execute(): Promise<BitcoinDepositEvent[]> {
    const pendingDeposits =
      await this.bitcoinDepositsEventsRepository.findByStatus('pending');

    const { length } = pendingDeposits;

    const newConfirmedDeposits: BitcoinDepositEvent[] = [];

    const serializeVerifications = async (index: number): Promise<string> => {
      if (index === length) return 'done';
      const deposit = pendingDeposits[index];
      const transaction = await this.bitcoin.getTransactionByTxid(deposit.txid);

      if (!transaction) return serializeVerifications(index + 1);

      const { confirmations } = transaction;

      const confirmed = confirmations > 2;

      if (!confirmed) return serializeVerifications(index + 1);

      deposit.status = 'confirmed';
      await this.bitcoinDepositsEventsRepository.save(deposit);

      newConfirmedDeposits.push(deposit);

      // const userDeposit =
      //   await this.usersBitcoinDepositsEventsRepository.findByAddress(
      //     deposit.address,
      //   );

      // if (!userDeposit) return serializeVerifications(index + 1);

      // const amountok = deposit.satoshis === userDeposit.satoshis;
      // const timeok = isBefore(
      //   deposit.created_at,
      //   addMinutes(userDeposit.created_at, 5),
      // );
      // const usd_cents =
      //   amountok && timeok ? userDeposit.usd_cents : deposit.usd_cents;

      return serializeVerifications(index + 1);
    };

    await serializeVerifications(0);

    return newConfirmedDeposits;
  }
}
export default CheckPendingBitcoinDepositsService;
