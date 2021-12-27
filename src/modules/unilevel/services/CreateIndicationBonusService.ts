import BigNumber from 'bignumber.js';
import { inject, injectable } from 'tsyringe';
import ICreateTransferDTO from '../../balances/dtos/ICreateTransferDTO';
import IUnilevelNodesRepository from '../repositories/IUnilevelNodesRepository';

interface IParams {
  user_id: string;
  usd_cents: number;
  // plan_id: string;
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
  }: // plan_id,
  IParams): Promise<ICreateTransferDTO[]> {
    const result: ICreateTransferDTO[] = [];
    // const plan = await this.plansRepository.findById(plan_id);
    // if (!plan) return result;
    const userNode = await this.unilevelNodesRepository.findByUserId(user_id);
    if (!userNode) return result;

    const { indicator_id } = userNode;

    result.push({
      card: 'available',
      user_id: indicator_id,
      description: 'Direct Indication Bonus',
      usd_cents: new BigNumber(usd_cents).multipliedBy(0.1).toNumber(),
    });

    return result;
  }
}
export default CreateIndicationBonusService;
