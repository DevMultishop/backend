// import FakeUsersBalancesRepository from '../repositories/fakes/FakeUsersBalancesRepository';
// import GetUserCardBalanceService from './GetUserCardBalanceService';

// let fakeUsersBalancesRepository: FakeUsersBalancesRepository;
// let getUserCardBalanceService: GetUserCardBalanceService;

// describe('GetUserCardBalanceService tests', () => {
//   beforeEach(() => {
//     fakeUsersBalancesRepository = new FakeUsersBalancesRepository();
//     getUserCardBalanceService = new GetUserCardBalanceService(
//       fakeUsersBalancesRepository,
//     );
//   });
//   it('should create and return a user balance equals to zero', async () => {
//     await expect(
//       getUserCardBalanceService.execute({ user_id: '1', card: 'credit' }),
//     ).resolves.toHaveProperty('usd_cents', 0);
//   });
//   it('should return a user balance equals to zero', async () => {
//     await fakeUsersBalancesRepository.create({
//       card: 'credit',
//       user_id: '1',
//     });
//     await expect(
//       getUserCardBalanceService.execute({ user_id: '1', card: 'credit' }),
//     ).resolves.toHaveProperty('usd_cents', 0);
//   });
// });
