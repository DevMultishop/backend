// import FakeCacheProvider from '../../../shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeBinariesNodesRepository from '../repositories/fakes/FakeBinariesNodesRepository';
import GetBinaryUplinesService from './GetBinaryUplinesService';

let getBinaryUplinesService: GetBinaryUplinesService;
let fakeBinariesNodesRepository: FakeBinariesNodesRepository;

// let fakeCacheProvider: FakeCacheProvider;

describe('GetBinaryUplinesService tests', () => {
  beforeEach(() => {
    fakeBinariesNodesRepository = new FakeBinariesNodesRepository();

    // fakeCacheProvider = new FakeCacheProvider();
    getBinaryUplinesService = new GetBinaryUplinesService(
      fakeBinariesNodesRepository,
      // fakeCacheProvider,
    );
  });

  it('should return an array with the higher node', async () => {
    const higher = await fakeBinariesNodesRepository.create({
      depth: 1,
      higher_id: '0',
      position: 'left',
      user_id: 'a',
    });
    const leftChild = await fakeBinariesNodesRepository.create({
      user_id: 'b',
      position: 'left',
      higher_id: higher.id,
      depth: 2,
    });

    let result = await getBinaryUplinesService.execute({
      user_id: leftChild.user_id,
    });

    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty('user_id', 'a');
    expect(result[0]).toHaveProperty('position', 'left');

    result = await getBinaryUplinesService.execute({
      user_id: leftChild.user_id,
    });

    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty('user_id', 'a');
    expect(result[0]).toHaveProperty('position', 'left');
  });

  it('should return an array with the higher node', async () => {
    const a = await fakeBinariesNodesRepository.create({
      depth: 1,
      higher_id: '0',
      position: 'left',
      user_id: 'a',
    });
    const b = await fakeBinariesNodesRepository.create({
      user_id: 'b',
      position: 'left',
      higher_id: a.id,
      depth: 2,
    });

    const c = await fakeBinariesNodesRepository.create({
      user_id: 'c',
      position: 'right',
      higher_id: a.id,
      depth: 2,
    });

    let result = await getBinaryUplinesService.execute({
      user_id: b.user_id,
    });

    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty('user_id', 'a');
    expect(result[0]).toHaveProperty('position', 'left');

    result = await getBinaryUplinesService.execute({
      user_id: b.user_id,
    });

    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty('user_id', 'a');
    expect(result[0]).toHaveProperty('position', 'left');

    result = await getBinaryUplinesService.execute({
      user_id: c.user_id,
    });

    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty('user_id', 'a');
    expect(result[0]).toHaveProperty('position', 'left');
  });

  it('should return an array with the higher node', async () => {
    const a = await fakeBinariesNodesRepository.create({
      depth: 1,
      higher_id: '0',
      position: 'left',
      user_id: 'a',
    });
    const [b, c] = await Promise.all([
      fakeBinariesNodesRepository.create({
        user_id: 'b',
        position: 'left',
        higher_id: a.id,
        depth: 2,
      }),
      fakeBinariesNodesRepository.create({
        user_id: 'c',
        position: 'right',
        higher_id: a.id,
        depth: 2,
      }),
    ]);
    const [d, e, f, g] = await Promise.all([
      fakeBinariesNodesRepository.create({
        user_id: 'd',
        position: 'left',
        higher_id: b.id,
        depth: 3,
      }),
      fakeBinariesNodesRepository.create({
        user_id: 'e',
        position: 'right',
        higher_id: b.id,
        depth: 3,
      }),
      fakeBinariesNodesRepository.create({
        user_id: 'f',
        position: 'left',
        higher_id: c.id,
        depth: 3,
      }),
      fakeBinariesNodesRepository.create({
        user_id: 'g',
        position: 'right',
        higher_id: c.id,
        depth: 3,
      }),
    ]);

    let result = await getBinaryUplinesService.execute({
      user_id: g.user_id,
    });

    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty('user_id', 'c');
    expect(result[0]).toHaveProperty('position', 'right');

    expect(result[1]).toHaveProperty('user_id', 'a');
    expect(result[1]).toHaveProperty('position', 'left');

    result = await getBinaryUplinesService.execute({
      user_id: f.user_id,
    });

    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty('user_id', 'c');
    expect(result[0]).toHaveProperty('position', 'right');

    expect(result[1]).toHaveProperty('user_id', 'a');
    expect(result[1]).toHaveProperty('position', 'left');

    result = await getBinaryUplinesService.execute({
      user_id: e.user_id,
    });

    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty('user_id', 'b');
    expect(result[0]).toHaveProperty('position', 'left');

    expect(result[1]).toHaveProperty('user_id', 'a');
    expect(result[1]).toHaveProperty('position', 'left');

    result = await getBinaryUplinesService.execute({
      user_id: d.user_id,
    });

    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty('user_id', 'b');
    expect(result[0]).toHaveProperty('position', 'left');

    expect(result[1]).toHaveProperty('user_id', 'a');
    expect(result[1]).toHaveProperty('position', 'left');

    result = await getBinaryUplinesService.execute({
      user_id: b.user_id,
    });

    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty('user_id', 'a');
    expect(result[0]).toHaveProperty('position', 'left');

    result = await getBinaryUplinesService.execute({
      user_id: a.user_id,
    });

    expect(result).toHaveLength(0);
  });
});
