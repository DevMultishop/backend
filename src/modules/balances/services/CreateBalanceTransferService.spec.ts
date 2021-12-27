// import FakeTransfersRepository from '../repositories/fakes/FakeTransfersRepository';
// import FakeUsersBalancesRepository from '../repositories/fakes/FakeUsersBalancesRepository';
// import CreateBalanceTransferService from './CreateBalanceTransferService';

// let fakeUsersBalancesRepository: FakeUsersBalancesRepository;
// let fakeTransfersRepository: FakeTransfersRepository;
// let createBalanceTransferService: CreateBalanceTransferService;

// describe('CreateBalanceTransferService tests', () => {
//   beforeEach(() => {
//     fakeUsersBalancesRepository = new FakeUsersBalancesRepository();
//     fakeTransfersRepository = new FakeTransfersRepository();
//     createBalanceTransferService = new CreateBalanceTransferService(
//       fakeUsersBalancesRepository,
//       fakeTransfersRepository,
//     );
//   });
//   it('should throw an error about negative balance', async () => {
//     await expect(
//       createBalanceTransferService.execute({
//         user_id: '1',
//         card: 'credit',
//         usd_cents: -10000,
//         description: 'test',
//       }),
//     ).rejects.toHaveProperty('message', 'Saldo nao pode ser negativo');
//   });
//   it('should return a user balance equals to zero', async () => {
//     await expect(
//       createBalanceTransferService.execute({
//         user_id: '1',
//         card: 'credit',
//         usd_cents: 10000,
//         description: 'test',
//       }),
//     ).resolves.toHaveProperty('usd_cents', 10000);
//   });

//   it('should return a user balance equals to zero', async () => {
//     await fakeUsersBalancesRepository.create({
//       user_id: '1',
//       card: 'credit',
//     });
//     await expect(
//       createBalanceTransferService.execute({
//         user_id: '1',
//         card: 'credit',
//         usd_cents: 10000,
//         description: 'test',
//       }),
//     ).resolves.toHaveProperty('usd_cents', 10000);
//     await expect(
//       createBalanceTransferService.execute({
//         user_id: '1',
//         card: 'credit',
//         usd_cents: -10000,
//         description: 'test',
//       }),
//     ).resolves.toHaveProperty('usd_cents', -10000);
//   });
// });
