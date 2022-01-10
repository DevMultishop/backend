import SignupResolver from './SignUpResolver';
import ProfileResolver from './ProfileResolver';
import BitcoinResolver from './BitcoinResolver';
import BalancesResolver from './BalancesResolver';
import PlansResolver from './PlansResolver';
import ChartsResolver from './ChartsResolver';
import WithdrawalResolver from './WithdrawalResolver';
import StatmentResolver from './StatmentResolver';
import AdminsResolver from './AdminsResolvers';
import UnilevelResolver from './UnilevelResolver';

export default [
  UnilevelResolver,
  StatmentResolver,
  WithdrawalResolver,
  ChartsResolver,
  SignupResolver,
  ProfileResolver,
  BitcoinResolver,
  BalancesResolver,
  PlansResolver,
  AdminsResolver,
];
