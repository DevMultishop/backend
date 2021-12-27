import FakeUnilevelNodesRepository from '../repositories/fakes/FakeUnilevelNodesRepository';
import CreateIndicationBonusService from './CreateIndicationBonusService';

let fakeUnilevelNodesRepository: FakeUnilevelNodesRepository;
let createIndicationBonusService: CreateIndicationBonusService;

describe('CreateIndicationBonusService tests', () => {
  beforeEach(() => {
    fakeUnilevelNodesRepository = new FakeUnilevelNodesRepository();
    createIndicationBonusService = new CreateIndicationBonusService(
      fakeUnilevelNodesRepository,
    );
  });
  it('should return an empty array', async () => {
    await expect(
      createIndicationBonusService.execute({
        user_id: '2',
        usd_cents: 10,
      }),
    ).resolves.toHaveLength(0);
  });
  it('should return an empty array', async () => {
    await fakeUnilevelNodesRepository.create({
      indicator_id: '1',
      user_id: '2',
    });

    const result = await createIndicationBonusService.execute({
      user_id: '2',
      usd_cents: 10000,
    });
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty('card', 'available');
    expect(result[0]).toHaveProperty('description', 'Bonus Direto');
    expect(result[0]).toHaveProperty('user_id', '1');
    expect(result[0]).toHaveProperty('usd_cents', 1000);
  });
});
