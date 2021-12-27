declare namespace BitcoinCore {
  interface Options {
    version: '0.17.0';
    wallet?: string;
    host: string;
    port: number;
    network: string;
    username: string;
    password: string;
  }

  type EstimateMode = 'UNSET' | 'ECONOMICAL' | 'CONSERVATIVE';

  interface EstimateSmartFee {
    blocks: number;
    feerate?: number;
    errors?: string[];
  }

  interface Address {
    address: string;
    scriptPubKey: string;
    ismine: boolean;
    iswatchonly: boolean;
    solvable: boolean;
    desc?: string;
    isscript: boolean;
    ischange: boolean;
    iswitness: boolean;
  }

  interface Block {
    hash: string;
    confirmations: number;
    size: number;
    strippedsize: number;
    weight: number;
    height: number;
    version: number;
    versionHex: string;
    merkleroot: string;
    tx: string[];
    time: number;
    mediantime: number;
    nonce: number;
    bits: string;
    difficulty: number;
    chainwork: string;
    nTx: number;
    previousblockhash: string;
    nextblockhash: string;
  }

  interface TransactionDetails {
    address: string;
    category: 'receive' | 'send';
    amount: number;
    label: string;
    vout: number;
    fee: number;
    abandoned: boolean;
  }

  interface Transaction {
    amount: number;
    fee: number;
    confirmations: number;
    blockhash?: string;
    blockindex: number;
    blocktime: number;
    txid: string;
    time: number;
    timereceived: number;
    details: TransactionDetails[];
    hex: string;
  }

  interface SendManyAmounts {
    [key: string]: string;
  }

  interface AddressValidate {
    isvalid: boolean;
    address: string;
    scriptPubKey: string;
    isscript: boolean;
    iswitness: boolean;
  }
}

declare module 'bitcoin-core' {
  export interface Server {
    estimateSmartFee(
      conf_target: number,
      estimate_mode: BitcoinCore.EstimateMode,
    ): Promise<BitcoinCore.EstimateSmartFee>;

    // validateAddress(address: string): Promise<BitcoinCore.AddressValidate>;

    // getAddressInfo(address: string): Promise<BitcoinCore.Address>;

    getBalance(dummy?: string, minconf?: number): Promise<number>;

    // generate(nblocks: number): Promise<string[]>;

    getNewAddress(label?: string): Promise<string>;

    getBlock(blockhash: string): Promise<BitcoinCore.Block>;

    // sendToAddress(
    //   address: string,
    //   amount: number,
    //   comment: string,
    //   comment_to: string,
    //   subtractfeefromamount: boolean,
    //   replaceable: boolean,
    //   conf_target: number,
    //   estimate_mode: BitcoinCore.EstimateMode,
    // ): Promise<string>;

    sendMany(
      address: string,
      amounts: BitcoinCore.SendManyAmounts,
      minconf: number,
      comment: string,
      subtractfeefrom: string[],
      replaceable: boolean,
      conf_target: number,
      estimate_mode: BitcoinCore.EstimateMode,
    ): Promise<string>;

    getTransaction(txid: string): Promise<BitcoinCore.Transaction>;
  }

  const BitcoinServer: {
    new (options: BitcoinCore.Options): Server;
  };

  export default BitcoinServer;
}
