import { inject, injectable } from 'tsyringe';
import path from 'path';
import IMailProvider from '../../../shared/container/providers/MailProvider/models/IMailProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import mailConfig from '../../../config/mail';
import IFinancialPasswordsEventsRepository from '../repositories/IFinancialPasswordsEventsRepository';
import app from '../../../config/app';

@injectable()
class CreateFinancialPasswordEventService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('FinancialPasswordsEventsRepository')
    private financialPasswordsEventsRepository: IFinancialPasswordsEventsRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) {}

  public async execute(user_id: string): Promise<string> {
    const emailExists = await this.usersRepository.findById(user_id);
    if (!emailExists) throw new Error('User not found');

    const event = await this.financialPasswordsEventsRepository.create(
      emailExists.email,
    );

    const template = path.resolve(
      mailConfig.templatesFolder,
      'financial_password.hbs',
    );

    await this.mailProvider.sendMail({
      to: {
        name: emailExists.full_name,
        email: emailExists.email,
      },
      subject: `[${app.name}] Financial Password`,
      templateData: {
        file: template,
        variables: {
          name: emailExists.full_name,
          token: event.id,
          appName: app.name,
        },
      },
    });

    return 'Access your email and copy the verification code to continue';
  }
}
export default CreateFinancialPasswordEventService;
