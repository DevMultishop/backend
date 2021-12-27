import { inject, injectable } from 'tsyringe';
import path from 'path';
import IMailProvider from '../../../shared/container/providers/MailProvider/models/IMailProvider';
import IEmailsVerificationEventsRepository from '../repositories/IEmailsVerificationEventsRepository';
import IUsersRepository from '../repositories/IUsersRepository';
import mailConfig from '../../../config/mail';
import ICreateEmailVerificationEventDTO from '../dtos/ICreateEmailVerificationEventDTO';
import app from '../../../config/app';

@injectable()
class CreateEmailVerificationEventService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('EmailsVerificationEventsRepository')
    private emailsVerificationEventsRepository: IEmailsVerificationEventsRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) {}

  public async execute({
    indicator_id,
    full_name,
    email,
  }: ICreateEmailVerificationEventDTO): Promise<string> {
    /**
     * email nao deve ser cadastrado
     */
    const emailExists = await this.usersRepository.findByEmail(email);
    if (emailExists) throw new Error('E-mail is unavailable');

    const emailVerification =
      await this.emailsVerificationEventsRepository.create({
        email,
        full_name,
        indicator_id,
      });

    const template = path.resolve(
      mailConfig.templatesFolder,
      'confirm_account.hbs',
    );

    await this.mailProvider.sendMail({
      to: {
        name: 'no-reply',
        email,
      },
      subject: `[${app.name}] E-mail confirmation`,
      templateData: {
        file: template,
        variables: {
          token: emailVerification.id,
          appName: app.name,
        },
      },
    });

    return emailVerification.id;
  }
}
export default CreateEmailVerificationEventService;
