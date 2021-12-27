import { inject, injectable } from 'tsyringe';
import IPlansRepository from '../../plans/repositories/IPlansRepository';
// import ICacheProvider from '../../../shared/container/providers/CacheProvider/models/ICacheProvider';
// import IFindConnectedNodesByUserIdDTO from '../dtos/IFindConnectedNodesByUserIdDTO';
import BinaryNode from '../infra/typeorm/entities/BinaryNode';
import UserBinaryPoint from '../infra/typeorm/entities/UserBinaryPoint';
import IBinariesNodesRepository from '../repositories/IBinariesNodesRepository';
import IUsersBinaryPointsRepository from '../repositories/IUsersBinaryPointsRepository';

interface IParams {
  plan_id: string;
  from_user_id: string;
  userNode: BinaryNode;
  usd_cents: number;
}

@injectable()
class CreateUsersBinaryPointsService {
  constructor(
    @inject('UsersBinaryPointsRepository')
    private usersBinaryPointsRepository: IUsersBinaryPointsRepository,

    @inject('BinariesNodesRepository')
    private binariesNodesRepository: IBinariesNodesRepository,

    @inject('PlansRepository')
    private plansRepository: IPlansRepository, // @inject('CacheProvider') // private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    plan_id,
    from_user_id,
    userNode,
    usd_cents,
  }: IParams): Promise<UserBinaryPoint[]> {
    const plan = await this.plansRepository.findById(plan_id);

    if (!plan) throw new Error('Plan not found');
    // if (plan.name === '50 BLB') return [];

    const createBinaryBranch = async (
      userId: string,
      nodes: BinaryNode[],
    ): Promise<BinaryNode[]> => {
      // let connectedNodes =
      //   await this.cacheProvider.recover<IFindConnectedNodesByUserIdDTO>(
      //     `binary_connected_nodes:${userId}`,
      //   );

      // if (!connectedNodes) {
      const connectedNodes =
        await this.binariesNodesRepository.findConnectedNodesByUserId(userId);
      // await this.cacheProvider.save(
      //   `binary_connected_nodes:${userId}`,
      //   connectedNodes,
      // );
      // }
      if (connectedNodes.higher && connectedNodes.higher.user_id) {
        nodes.push(connectedNodes.higher);
        return createBinaryBranch(connectedNodes.higher.user_id, nodes);
      }
      return nodes;
    };

    const binaryUplines = await createBinaryBranch(from_user_id, []);

    let { position } = userNode;

    const points = Math.round(usd_cents * 0.01); // cada dolar é um ponto

    const pointsArray = binaryUplines.map(binaryNode => {
      const carrerPoint = {
        position,
        user_id: binaryNode.user_id,
      };
      position = binaryNode.position;
      return carrerPoint;
    });

    return Promise.all(
      pointsArray.map(point =>
        this.usersBinaryPointsRepository.create({
          from_user_id,
          points,
          position: point.position,
          user_id: point.user_id,
        }),
      ),
    );
  }
}
export default CreateUsersBinaryPointsService;
