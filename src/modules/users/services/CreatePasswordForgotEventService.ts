import { inject, injectable } from 'tsyringe';
import path from 'path';
import IMailProvider from '../../../shared/container/providers/MailProvider/models/IMailProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import mailConfig from '../../../config/mail';
import IPasswordsForgotEventsRepository from '../repositories/IPasswordsForgotEventsRepository';
import app from '../../../config/app';

@injectable()
class CreatePasswordForgotEventService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('PasswordsForgotEventsRepository')
    private passwordsForgotEventsRepository: IPasswordsForgotEventsRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) {}

  public async execute(email: string): Promise<string> {
    const emailExists = await this.usersRepository.findByEmail(email);
    if (!emailExists) throw new Error('E-mail not found');

    const passwordForgotEvent =
      await this.passwordsForgotEventsRepository.create(email);

    const template = path.resolve(
      mailConfig.templatesFolder,
      'forgot_password.hbs',
    );

    await this.mailProvider.sendMail({
      to: {
        name: emailExists.full_name,
        email,
      },
      subject: `[${app.name}] Password Recovery`,
      templateData: {
        file: template,
        variables: {
          token: passwordForgotEvent.id,
          name: emailExists.full_name,
          appName: app.name,
        },
      },
    });

    return 'Access your email and copy the verification code to change your password';
  }
}
export default CreatePasswordForgotEventService;
