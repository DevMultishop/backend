import BigNumber from 'bignumber.js';
import { inject, injectable } from 'tsyringe';
import ICreateTransferDTO from '../../balances/dtos/ICreateTransferDTO';
import IUnilevelNodesRepository from '../repositories/IUnilevelNodesRepository';

interface IParams {
  user_id: string;
  usd_cents: number;
}

@injectable()
class CreateIndicationBonusService {
  constructor(
    @inject('UnilevelNodesRepository')
    private unilevelNodesRepository: IUnilevelNodesRepository,
  ) {}

  public async execute({
    user_id,
    usd_cents,
  }: IParams): Promise<ICreateTransferDTO[]> {
    const result: ICreateTransferDTO[] = [];
    let userNode = await this.unilevelNodesRepository.findByUserId(user_id);
    if (!userNode) return result;

    let { indicator_id } = userNode;

    result.push({
      card: 'available',
      user_id: indicator_id,
      description: 'Direct Indication Bonus',
      usd_cents: new BigNumber(usd_cents).multipliedBy(0.1).toNumber(),
    });

    userNode = await this.unilevelNodesRepository.findByUserId(indicator_id);
    if (!userNode) return result;

    indicator_id = userNode.indicator_id;

    result.push({
      card: 'available',
      user_id: indicator_id,
      description: 'Indirect Indication Bonus',
      usd_cents: new BigNumber(usd_cents).multipliedBy(0.05).toNumber(),
    });

    return result;
  }
}
export default CreateIndicationBonusService;
