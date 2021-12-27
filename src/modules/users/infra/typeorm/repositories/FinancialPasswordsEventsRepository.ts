import { getRepository } from 'typeorm';
import IFinancialPasswordsEventsRepository from '../../../repositories/IFinancialPasswordsEventsRepository';
import FinancialPasswordEvent from '../entities/FinancialPasswordEvent';

class FinancialPasswordsEventsRepository
  implements IFinancialPasswordsEventsRepository
{
  constructor(private ormRepository = getRepository(FinancialPasswordEvent)) {}

  public async create(email: string): Promise<FinancialPasswordEvent> {
    const event = this.ormRepository.create({
      email,
    });
    await this.ormRepository.save(event);
    return event;
  }

  public async findById(
    id: string,
  ): Promise<FinancialPasswordEvent | undefined> {
    return this.ormRepository.findOne(id);
  }

  public async findByEmail(
    email: string,
  ): Promise<FinancialPasswordEvent | undefined> {
    return this.ormRepository.findOne({ where: { email } });
  }
}
export default FinancialPasswordsEventsRepository;
