// import FakeTransfersRepository from '../../balances/repositories/fakes/FakeTransfersRepository';
// import FakeUsersBalancesRepository from '../../balances/repositories/fakes/FakeUsersBalancesRepository';
// import FakeUsersPlansRepository from '../repositories/fakes/FakeUsersPlansRepository';
// import CreateUserPlanGainService from './CreateUserPlanGainService';

// let fakeUsersPlansRepository: FakeUsersPlansRepository;
// let fakeUsersBalancesRepository: FakeUsersBalancesRepository;
// let fakeTransfersRepository: FakeTransfersRepository;
// let createUserPlanGainService: CreateUserPlanGainService;

// describe('CreateUserPlanGainService tests', () => {
//   beforeEach(() => {
//     fakeUsersPlansRepository = new FakeUsersPlansRepository();
//     fakeUsersBalancesRepository = new FakeUsersBalancesRepository();
//     fakeTransfersRepository = new FakeTransfersRepository();
//     createUserPlanGainService = new CreateUserPlanGainService(
//       fakeUsersPlansRepository,
//       fakeUsersBalancesRepository,
//       fakeTransfersRepository,
//     );
//   });
//   it('should return an empty array', async () => {
//     await expect(
//       createUserPlanGainService.execute({
//         card: 'available',
//         description: 'teste',
//         usd_cents: 100,
//         user_id: '1',
//       }),
//     ).resolves.toHaveLength(0);
//   });
//   it('should return an empty array', async () => {
//     const userPlan = await fakeUsersPlansRepository.create({
//       user_id: '1',
//       plan_id: '1',
//       limit_usd_cents: 1000,
//       progress_usd_cents: 0,
//     });
//     userPlan.filled_at = new Date();
//     await fakeUsersPlansRepository.save(userPlan);
//     await expect(
//       createUserPlanGainService.execute({
//         card: 'available',
//         description: 'teste',
//         usd_cents: 100,
//         user_id: '1',
//       }),
//     ).resolves.toHaveLength(0);
//   });
//   it('should return an empty array', async () => {
//     const userPlan = await fakeUsersPlansRepository.create({
//       user_id: '1',
//       plan_id: '1',
//       limit_usd_cents: 1000,
//       progress_usd_cents: 0,
//     });
//     await fakeUsersPlansRepository.save(userPlan);

//     const result = await createUserPlanGainService.execute({
//       card: 'available',
//       description: 'teste',
//       usd_cents: 100,
//       user_id: '1',
//     });
//     expect(result).toHaveLength(1);
//     expect(result[0]).toHaveProperty('usd_cents', 100);

//     const updatedPlan = await fakeUsersPlansRepository.findById(userPlan.id);
//     expect(updatedPlan).toHaveProperty('progress_usd_cents', 100);
//     expect(updatedPlan).toHaveProperty('filled_at', null);
//   });
//   it('should return an empty array', async () => {
//     const userPlan = await fakeUsersPlansRepository.create({
//       user_id: '1',
//       plan_id: '1',
//       limit_usd_cents: 1000,
//       progress_usd_cents: 0,
//     });
//     await fakeUsersPlansRepository.save(userPlan);

//     const result = await createUserPlanGainService.execute({
//       card: 'available',
//       description: 'teste',
//       usd_cents: 500,
//       user_id: '1',
//     });
//     expect(result).toHaveLength(1);
//     expect(result[0]).toHaveProperty('usd_cents', 500);

//     const updatedPlan = await fakeUsersPlansRepository.findById(userPlan.id);
//     expect(updatedPlan).toHaveProperty('progress_usd_cents', 500);
//     expect(updatedPlan).toHaveProperty('filled_at', null);
//   });

//   it('should return an empty array', async () => {
//     const userPlan = await fakeUsersPlansRepository.create({
//       user_id: '1',
//       plan_id: '1',
//       limit_usd_cents: 1000,
//       progress_usd_cents: 0,
//     });
//     await fakeUsersPlansRepository.save(userPlan);

//     const result = await createUserPlanGainService.execute({
//       card: 'available',
//       description: 'teste',
//       usd_cents: 1000,
//       user_id: '1',
//     });
//     expect(result).toHaveLength(1);
//     expect(result[0]).toHaveProperty('usd_cents', 1000);

//     const updatedPlan = await fakeUsersPlansRepository.findById(userPlan.id);
//     expect(updatedPlan).toHaveProperty('progress_usd_cents', 1000);
//     expect(updatedPlan?.filled_at).toBeInstanceOf(Date);
//   });

//   it('should return an empty array', async () => {
//     const userPlan = await fakeUsersPlansRepository.create({
//       user_id: '1',
//       plan_id: '1',
//       limit_usd_cents: 1000,
//       progress_usd_cents: 0,
//     });
//     await fakeUsersPlansRepository.save(userPlan);

//     const result = await createUserPlanGainService.execute({
//       card: 'available',
//       description: 'teste',
//       usd_cents: 1001,
//       user_id: '1',
//     });
//     expect(result).toHaveLength(1);
//     expect(result[0]).toHaveProperty('usd_cents', 1000);

//     const updatedPlan = await fakeUsersPlansRepository.findById(userPlan.id);
//     expect(updatedPlan).toHaveProperty('progress_usd_cents', 1000);
//     expect(updatedPlan?.filled_at).toBeInstanceOf(Date);
//   });
//   it('should return an empty array', async () => {
//     const userPlan = await fakeUsersPlansRepository.create({
//       user_id: '1',
//       plan_id: '1',
//       limit_usd_cents: 1000,
//       progress_usd_cents: 0,
//     });
//     const userPlan2 = await fakeUsersPlansRepository.create({
//       user_id: '1',
//       plan_id: '1',
//       limit_usd_cents: 1000,
//       progress_usd_cents: 0,
//     });

//     const result = await createUserPlanGainService.execute({
//       card: 'available',
//       description: 'teste',
//       usd_cents: 1001,
//       user_id: '1',
//     });
//     expect(result).toHaveLength(2);
//     expect(result[0]).toHaveProperty('usd_cents', 1000);
//     expect(result[1]).toHaveProperty('usd_cents', 1);

//     let updatedPlan = await fakeUsersPlansRepository.findById(userPlan.id);
//     expect(updatedPlan).toHaveProperty('progress_usd_cents', 1000);
//     expect(updatedPlan?.filled_at).toBeInstanceOf(Date);

//     updatedPlan = await fakeUsersPlansRepository.findById(userPlan2.id);
//     expect(updatedPlan).toHaveProperty('progress_usd_cents', 1);
//     expect(updatedPlan?.filled_at).toBe(null);

//     const userBalance = await fakeUsersBalancesRepository.findByUserIdAndCard({
//       user_id: '1',
//       card: 'available',
//     });
//     expect(userBalance).toHaveProperty('usd_cents', 1001);
//   });
// });
