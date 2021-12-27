import FakeQueue from '../../../shared/container/providers/QueueProvider/fakes/FakeQueue';
import FakePlansRepository from '../repositories/fakes/FakePlansRepository';
import FakeUsersPlansRepository from '../repositories/fakes/FakeUsersPlansRepository';
import CreateUserPlanService from './CreateUserPlanService';

let fakeUsersPlansRepository: FakeUsersPlansRepository;
let fakePlansRepository: FakePlansRepository;
let fakeQueue: FakeQueue;
let createUserPlanService: CreateUserPlanService;

describe('CreateUserPlanService tests', () => {
  beforeEach(() => {
    fakeUsersPlansRepository = new FakeUsersPlansRepository();
    fakePlansRepository = new FakePlansRepository();
    fakeQueue = new FakeQueue();
    createUserPlanService = new CreateUserPlanService(
      fakeUsersPlansRepository,
      fakePlansRepository,
      fakeQueue,
    );
  });
  it('should throw an error about not founded plan', async () => {
    await expect(
      createUserPlanService.execute({
        plan_id: '2',
        user_id: '1',
      }),
    ).rejects.toHaveProperty('message', 'Plano nao encontrado');
  });
  it('should return a user plan', async () => {
    const userPlan = await createUserPlanService.execute({
      plan_id: '1',
      user_id: '1',
    });
    expect(userPlan).toBe(10000);
  });
});
