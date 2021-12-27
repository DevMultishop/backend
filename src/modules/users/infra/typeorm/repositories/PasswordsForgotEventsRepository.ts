import { getRepository } from 'typeorm';
import IPasswordsForgotEventsRepository from '../../../repositories/IPasswordsForgotEventsRepository';
import PasswordForgotEvent from '../entities/PasswordForgotEvent';

class PasswordsForgotEventsRepository
  implements IPasswordsForgotEventsRepository
{
  constructor(private ormRepository = getRepository(PasswordForgotEvent)) {}

  public async create(email: string): Promise<PasswordForgotEvent> {
    const event = this.ormRepository.create({ email });
    await this.ormRepository.save(event);
    return event;
  }

  public async findById(id: string): Promise<PasswordForgotEvent | undefined> {
    return this.ormRepository.findOne(id);
  }
}

export default PasswordsForgotEventsRepository;
