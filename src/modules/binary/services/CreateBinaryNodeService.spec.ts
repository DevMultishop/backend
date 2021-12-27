import FakeUnilevelNodesRepository from '../../unilevel/repositories/fakes/FakeUnilevelNodesRepository';
// import FakeCacheProvider from '../../../shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeBinariesNodesRepository from '../repositories/fakes/FakeBinariesNodesRepository';
import FakeUsersBinaryKeysRepository from '../repositories/fakes/FakeUsersBinaryKeysRepository';
import CreateBinaryNodeService from './CreateBinaryNodeService';

let createBinaryNodeService: CreateBinaryNodeService;
let fakeBinariesNodesRepository: FakeBinariesNodesRepository;
let fakeUsersBinaryKeysRepository: FakeUsersBinaryKeysRepository;
let fakeUnilevelRepository: FakeUnilevelNodesRepository;
// let fakeCacheProvider: FakeCacheProvider;

describe('CreateBinaryNodeService tests', () => {
  beforeEach(() => {
    fakeBinariesNodesRepository = new FakeBinariesNodesRepository();
    fakeUsersBinaryKeysRepository = new FakeUsersBinaryKeysRepository();
    fakeUnilevelRepository = new FakeUnilevelNodesRepository();
    // fakeCacheProvider = new FakeCacheProvider();
    createBinaryNodeService = new CreateBinaryNodeService(
      fakeBinariesNodesRepository,
      fakeUnilevelRepository,
      // fakeCacheProvider,
      fakeUsersBinaryKeysRepository,
    );
  });

  it('should throw an error', async () => {
    await expect(
      createBinaryNodeService.execute({ user_id: '2' }),
    ).rejects.toHaveProperty('message', 'Indicador não encontrado');
  });

  it('should throw an error', async () => {
    await fakeUnilevelRepository.create({
      user_id: '2',
      indicator_id: '1',
    });
    await expect(
      createBinaryNodeService.execute({ user_id: '2' }),
    ).rejects.toHaveProperty(
      'message',
      'Indicador não encontrado na árvore binária',
    );
  });

  it('should create a binary tree when indicator is in left branch', async () => {
    const indicatorNode = await fakeBinariesNodesRepository.create({
      higher_id: '0',
      user_id: '1',
      position: 'left',
      depth: 0,
    });

    await fakeUnilevelRepository.create({
      user_id: '2',
      indicator_id: '1',
    });
    const firstLeft = await createBinaryNodeService.execute({
      user_id: '2',
    });
    expect(firstLeft).toHaveProperty('higher_id', indicatorNode.id);
    expect(firstLeft).toHaveProperty('user_id', '2');
    expect(firstLeft).toHaveProperty('position', 'left');

    await fakeUnilevelRepository.create({
      user_id: '3',
      indicator_id: '1',
    });
    const firstRight = await createBinaryNodeService.execute({
      user_id: '3',
    });
    expect(firstRight).toHaveProperty('higher_id', indicatorNode.id);
    expect(firstRight).toHaveProperty('user_id', '3');
    expect(firstRight).toHaveProperty('position', 'right');

    await fakeUnilevelRepository.create({
      user_id: '4',
      indicator_id: '1',
    });
    const secondLeft = await createBinaryNodeService.execute({
      user_id: '4',
    });
    expect(secondLeft).toHaveProperty('higher_id', firstLeft.id);
    expect(secondLeft).toHaveProperty('user_id', '4');
    expect(secondLeft).toHaveProperty('position', 'left');

    await fakeUnilevelRepository.create({
      user_id: '5',
      indicator_id: '1',
    });
    const secondRight = await createBinaryNodeService.execute({
      user_id: '5',
    });
    expect(secondRight).toHaveProperty('higher_id', firstRight.id);
    expect(secondRight).toHaveProperty('user_id', '5');
    expect(secondRight).toHaveProperty('position', 'right');
  });

  it('should create a binary tree when indicator is in right branch', async () => {
    const indicatorNode = await fakeBinariesNodesRepository.create({
      higher_id: '0',
      user_id: '1',
      position: 'right',
      depth: 0,
    });

    await fakeUnilevelRepository.create({
      user_id: '2',
      indicator_id: '1',
    });
    const firstLeft = await createBinaryNodeService.execute({
      user_id: '2',
    });
    expect(firstLeft).toHaveProperty('higher_id', indicatorNode.id);
    expect(firstLeft).toHaveProperty('user_id', '2');
    expect(firstLeft).toHaveProperty('position', 'left');

    await fakeUnilevelRepository.create({
      user_id: '3',
      indicator_id: '1',
    });
    const firstRight = await createBinaryNodeService.execute({
      user_id: '3',
    });
    expect(firstRight).toHaveProperty('higher_id', indicatorNode.id);
    expect(firstRight).toHaveProperty('user_id', '3');
    expect(firstRight).toHaveProperty('position', 'right');

    await fakeUnilevelRepository.create({
      user_id: '4',
      indicator_id: '1',
    });
    const secondLeft = await createBinaryNodeService.execute({
      user_id: '4',
    });
    expect(secondLeft).toHaveProperty('higher_id', firstLeft.id);
    expect(secondLeft).toHaveProperty('user_id', '4');
    expect(secondLeft).toHaveProperty('position', 'left');

    await fakeUnilevelRepository.create({
      user_id: '5',
      indicator_id: '1',
    });
    const secondRight = await createBinaryNodeService.execute({
      user_id: '5',
    });
    expect(secondRight).toHaveProperty('higher_id', firstRight.id);
    expect(secondRight).toHaveProperty('user_id', '5');
    expect(secondRight).toHaveProperty('position', 'right');

    await fakeUnilevelRepository.create({
      user_id: '6',
      indicator_id: '1',
    });
    const thirdLeft = await createBinaryNodeService.execute({
      user_id: '6',
    });
    expect(thirdLeft).toHaveProperty('higher_id', secondLeft.id);
    expect(thirdLeft).toHaveProperty('user_id', '6');
    expect(thirdLeft).toHaveProperty('position', 'left');

    await fakeUnilevelRepository.create({
      user_id: '7',
      indicator_id: '1',
    });
    const thirdRight = await createBinaryNodeService.execute({
      user_id: '7',
    });
    expect(thirdRight).toHaveProperty('higher_id', secondRight.id);
    expect(thirdRight).toHaveProperty('user_id', '7');
    expect(thirdRight).toHaveProperty('position', 'right');
  });

  it('should create a binary tree when indicator is in right branch', async () => {
    const indicatorNode = await fakeBinariesNodesRepository.create({
      higher_id: '0',
      user_id: '1',
      position: 'right',
      depth: 0,
    });

    await fakeUnilevelRepository.create({
      user_id: '2',
      indicator_id: '1',
    });
    const firstLeft = await createBinaryNodeService.execute({
      user_id: '2',
    });
    expect(firstLeft).toHaveProperty('higher_id', indicatorNode.id);
    expect(firstLeft).toHaveProperty('user_id', '2');
    expect(firstLeft).toHaveProperty('position', 'left');

    await fakeUnilevelRepository.create({
      user_id: '3',
      indicator_id: '1',
    });
    const firstRight = await createBinaryNodeService.execute({
      user_id: '3',
    });
    expect(firstRight).toHaveProperty('higher_id', indicatorNode.id);
    expect(firstRight).toHaveProperty('user_id', '3');
    expect(firstRight).toHaveProperty('position', 'right');

    await fakeUnilevelRepository.create({
      user_id: '4',
      indicator_id: '1',
    });
    const secondLeft = await createBinaryNodeService.execute({
      user_id: '4',
    });
    expect(secondLeft).toHaveProperty('higher_id', firstLeft.id);
    expect(secondLeft).toHaveProperty('user_id', '4');
    expect(secondLeft).toHaveProperty('position', 'left');

    await fakeUnilevelRepository.create({
      user_id: '5',
      indicator_id: '1',
    });
    const secondRight = await createBinaryNodeService.execute({
      user_id: '5',
    });
    expect(secondRight).toHaveProperty('higher_id', firstRight.id);
    expect(secondRight).toHaveProperty('user_id', '5');
    expect(secondRight).toHaveProperty('position', 'right');

    await fakeUnilevelRepository.create({
      user_id: '6',
      indicator_id: '1',
    });
    const thirdLeft = await createBinaryNodeService.execute({
      user_id: '6',
    });
    expect(thirdLeft).toHaveProperty('higher_id', secondLeft.id);
    expect(thirdLeft).toHaveProperty('user_id', '6');
    expect(thirdLeft).toHaveProperty('position', 'left');

    let indicatorKey = await fakeUsersBinaryKeysRepository.findByUserId(
      indicatorNode.user_id,
    );
    if (!indicatorKey)
      indicatorKey = await fakeUsersBinaryKeysRepository.create(
        indicatorNode.user_id,
      );
    indicatorKey.position = 'left';
    await fakeUsersBinaryKeysRepository.save(indicatorKey);

    await fakeUnilevelRepository.create({
      user_id: '7',
      indicator_id: '1',
    });
    const forthLeft = await createBinaryNodeService.execute({
      user_id: '7',
    });
    expect(forthLeft).toHaveProperty('higher_id', thirdLeft.id);
    expect(forthLeft).toHaveProperty('user_id', '7');
    expect(forthLeft).toHaveProperty('position', 'left');

    await fakeUnilevelRepository.create({
      user_id: '8',
      indicator_id: '1',
    });
    const fifthLeft = await createBinaryNodeService.execute({
      user_id: '8',
    });
    expect(fifthLeft).toHaveProperty('higher_id', forthLeft.id);
    expect(fifthLeft).toHaveProperty('user_id', '8');
    expect(fifthLeft).toHaveProperty('position', 'left');

    indicatorKey.position = 'automatic';
    await fakeUsersBinaryKeysRepository.save(indicatorKey);

    await fakeUnilevelRepository.create({
      user_id: '9',
      indicator_id: '1',
    });
    const thirdRight = await createBinaryNodeService.execute({
      user_id: '9',
    });
    expect(thirdRight).toHaveProperty('higher_id', secondRight.id);
    expect(thirdRight).toHaveProperty('user_id', '9');
    expect(thirdRight).toHaveProperty('position', 'right');

    indicatorKey.position = 'right';
    await fakeUsersBinaryKeysRepository.save(indicatorKey);

    await fakeUnilevelRepository.create({
      user_id: '10',
      indicator_id: '1',
    });
    const forthRight = await createBinaryNodeService.execute({
      user_id: '10',
    });
    expect(forthRight).toHaveProperty('higher_id', thirdRight.id);
    expect(forthRight).toHaveProperty('user_id', '10');
    expect(forthRight).toHaveProperty('position', 'right');
  });
});
