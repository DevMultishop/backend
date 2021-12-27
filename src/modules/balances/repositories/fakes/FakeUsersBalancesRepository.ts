// import { v4 } from 'uuid';
// import ICreateUserBalanceDTO from '../../dtos/ICreateUserBalanceDTO';
// import UserBalance from '../../infra/typeorm/entities/UserBalance';
// import IUsersBalancesRepository from '../IUsersBalancesRepository';

// class FakeUsersBalancesRepository implements IUsersBalancesRepository {
//   private balances: UserBalance[] = [];

//   public async create({
//     user_id,
//     card,
//   }: ICreateUserBalanceDTO): Promise<UserBalance> {
//     const balance = new UserBalance();
//     Object.assign(balance, {
//       user_id,
//       card,
//       usd_cents: 0,
//       updated_at: new Date(),
//       id: v4(),
//     });
//     this.balances.push(balance);
//     return balance;
//   }

//   public async save(balance: UserBalance): Promise<UserBalance> {
//     const index = this.balances.findIndex(b => b.id === balance.id);
//     this.balances[index] = balance;
//     return balance;
//   }

//   public async findByUserIdAndCard({
//     user_id,
//     card,
//   }: ICreateUserBalanceDTO): Promise<UserBalance | undefined> {
//     return this.balances.find(b => b.user_id === user_id && b.card === card);
//   }
// }

// export default FakeUsersBalancesRepository;
