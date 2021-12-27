interface IBitcoinConfig {
  name: string;

  connection: {
    version: '0.17.0';
    wallet?: string;
    host: string;
    port: number;
    network: string;
    username: string;
    password: string;
  };
}

export default {
  name: process.env.BITCOIN_NAME || 'default',
  connection: {
    version: '0.17.0',
    wallet: process.env.BITCOIN_WALLET,
    host: process.env.BITCOIN_HOST,
    port: Number(process.env.BITCOIN_PORT),
    network: process.env.BITCOIN_TYPE,
    username: process.env.BITCOIN_USER,
    password: process.env.BITCOIN_PASS,
  },
} as IBitcoinConfig;
