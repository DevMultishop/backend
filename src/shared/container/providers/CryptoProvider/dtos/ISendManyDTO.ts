export default interface ISendManyDTO {
  amounts: {
    [key: string]: string;
  };
  subtractFeeFrom: string[];
  minConf?: number;
  comment?: string;
  replaceable?: boolean;
  confTarget?: number;
  estimateMode?: 'UNSET' | 'ECONOMICAL' | 'CONSERVATIVE';
}
