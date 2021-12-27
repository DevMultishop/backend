import FakeUnilevelNodesRepository from '../repositories/fakes/FakeUnilevelNodesRepository';
import CreateUnilevelNodeService from './CreateUnilevelNodeService';

let fakeUnilevelNodesRepository: FakeUnilevelNodesRepository;
let createUnilevelNodeService: CreateUnilevelNodeService;

describe('CreateUnilevelNodeService tests', () => {
  beforeEach(() => {
    fakeUnilevelNodesRepository = new FakeUnilevelNodesRepository();
    createUnilevelNodeService = new CreateUnilevelNodeService(
      fakeUnilevelNodesRepository,
    );
  });
  it('should throw an error', async () => {
    await fakeUnilevelNodesRepository.create({
      indicator_id: '1',
      user_id: '2',
    });
    await expect(
      createUnilevelNodeService.execute({
        indicator_id: '1',
        user_id: '2',
      }),
    ).rejects.toHaveProperty('message', 'Usuario ja possui unilevel');
  });
  it('should create a new node', async () => {
    await expect(
      createUnilevelNodeService.execute({
        indicator_id: '1',
        user_id: '2',
      }),
    ).resolves.toHaveProperty('user_id', '2');
  });
});
