import BigNumber from 'bignumber.js';
import { inject, injectable } from 'tsyringe';
import ICreateTransferDTO from '../../balances/dtos/ICreateTransferDTO';
import IUnilevelNodesRepository from '../repositories/IUnilevelNodesRepository';

interface IParams {
  user_id: string;
  usd_cents: number;
}

@injectable()
class CreateIResidualBonusService {
  constructor(
    @inject('UnilevelNodesRepository')
    private unilevelNodesRepository: IUnilevelNodesRepository,
  ) {}

  public async execute({
    user_id,
    usd_cents,
  }: IParams): Promise<ICreateTransferDTO[]> {
    const result: ICreateTransferDTO[] = [];
    const userNode = await this.unilevelNodesRepository.findByUserId(user_id);
    if (!userNode) return result;

    const { indicator_id: direct_id } = userNode;

    result.push({
      card: 'available',
      user_id: direct_id,
      description: 'Residual Bonus',
      usd_cents: new BigNumber(usd_cents).multipliedBy(0.03).toNumber(),
    });

    const directNode = await this.unilevelNodesRepository.findByUserId(
      direct_id,
    );
    if (!directNode) return result;

    const indirect1_id = directNode.indicator_id;
    const indirect1Count = await this.unilevelNodesRepository.findAllIndicateds(
      indirect1_id,
    );

    if (indirect1Count >= 4)
      result.push({
        card: 'available',
        user_id: indirect1_id,
        description: 'Residual Bonus',
        usd_cents: new BigNumber(usd_cents).multipliedBy(0.03).toNumber(),
      });

    const indirect1Node = await this.unilevelNodesRepository.findByUserId(
      indirect1_id,
    );
    if (!indirect1Node) return result;

    const indirect2_id = indirect1Node.indicator_id;
    const indirect2Count = await this.unilevelNodesRepository.findAllIndicateds(
      indirect2_id,
    );

    if (indirect2Count >= 4)
      result.push({
        card: 'available',
        user_id: indirect2_id,
        description: 'Residual Bonus',
        usd_cents: new BigNumber(usd_cents).multipliedBy(0.03).toNumber(),
      });

    const indirect2Node = await this.unilevelNodesRepository.findByUserId(
      indirect2_id,
    );
    if (!indirect2Node) return result;

    const indirect3_id = indirect2Node.indicator_id;
    const indirect3Count = await this.unilevelNodesRepository.findAllIndicateds(
      indirect3_id,
    );

    if (indirect3Count >= 6)
      result.push({
        card: 'available',
        user_id: indirect3_id,
        description: 'Residual Bonus',
        usd_cents: new BigNumber(usd_cents).multipliedBy(0.03).toNumber(),
      });

    const indirect3Node = await this.unilevelNodesRepository.findByUserId(
      indirect3_id,
    );
    if (!indirect3Node) return result;

    const indirect4_id = indirect3Node.indicator_id;
    const indirect4Count = await this.unilevelNodesRepository.findAllIndicateds(
      indirect4_id,
    );

    if (indirect4Count >= 6)
      result.push({
        card: 'available',
        user_id: indirect4_id,
        description: 'Residual Bonus',
        usd_cents: new BigNumber(usd_cents).multipliedBy(0.03).toNumber(),
      });

    const indirect4Node = await this.unilevelNodesRepository.findByUserId(
      indirect4_id,
    );
    if (!indirect4Node) return result;

    const indirect5_id = indirect4Node.indicator_id;
    const indirect5Count = await this.unilevelNodesRepository.findAllIndicateds(
      indirect5_id,
    );

    if (indirect5Count >= 6)
      result.push({
        card: 'available',
        user_id: indirect5_id,
        description: 'Residual Bonus',
        usd_cents: new BigNumber(usd_cents).multipliedBy(0.03).toNumber(),
      });

    const indirect5Node = await this.unilevelNodesRepository.findByUserId(
      indirect5_id,
    );
    if (!indirect5Node) return result;

    const indirect6_id = indirect5Node.indicator_id;
    const indirect6Count = await this.unilevelNodesRepository.findAllIndicateds(
      indirect6_id,
    );

    if (indirect6Count >= 8)
      result.push({
        card: 'available',
        user_id: indirect6_id,
        description: 'Residual Bonus',
        usd_cents: new BigNumber(usd_cents).multipliedBy(0.03).toNumber(),
      });

    const indirect6Node = await this.unilevelNodesRepository.findByUserId(
      indirect6_id,
    );
    if (!indirect6Node) return result;

    const indirect7_id = indirect6Node.indicator_id;
    const indirect7Count = await this.unilevelNodesRepository.findAllIndicateds(
      indirect7_id,
    );

    if (indirect7Count >= 8)
      result.push({
        card: 'available',
        user_id: indirect7_id,
        description: 'Residual Bonus',
        usd_cents: new BigNumber(usd_cents).multipliedBy(0.03).toNumber(),
      });

    return result;
  }
}
export default CreateIResidualBonusService;
