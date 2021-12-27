import { container } from 'tsyringe';
import EmailsVerificationEventsRepository from '../infra/typeorm/repositories/EmailsVerificationEventsRepository';
import FinancialPasswordsEventsRepository from '../infra/typeorm/repositories/FinancialPasswordsEventsRepository';
import PasswordsForgotEventsRepository from '../infra/typeorm/repositories/PasswordsForgotEventsRepository';
import UsersAdminsRepository from '../infra/typeorm/repositories/UsersAdminsRepository';
import UsersBitcoinWalletsRepository from '../infra/typeorm/repositories/UsersBitcoinWalletsRepository';
import UsersPasswordsRepository from '../infra/typeorm/repositories/UsersPasswordsRepository';
import UsersRepository from '../infra/typeorm/repositories/UsersRepository';
import UsersSessionsEventsRepository from '../infra/typeorm/repositories/UsersSessionsEventsRepository';
import IEmailsVerificationEventsRepository from '../repositories/IEmailsVerificationEventsRepository';
import IFinancialPasswordsEventsRepository from '../repositories/IFinancialPasswordsEventsRepository';
import IPasswordsForgotEventsRepository from '../repositories/IPasswordsForgotEventsRepository';
import IUsersAdminsRepository from '../repositories/IUsersAdminsRepository';
import IUsersBitcoinWalletsRepository from '../repositories/IUsersBitcoinWalletsRepository';
import IUsersPasswordsRepository from '../repositories/IUsersPasswordsRepository';
import IUsersRepository from '../repositories/IUsersRepository';
import IUsersSessionsEventsRepository from '../repositories/IUsersSessionsEventsRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IUsersAdminsRepository>(
  'UsersAdminsRepository',
  UsersAdminsRepository,
);

container.registerSingleton<IEmailsVerificationEventsRepository>(
  'EmailsVerificationEventsRepository',
  EmailsVerificationEventsRepository,
);

container.registerSingleton<IUsersPasswordsRepository>(
  'UsersPasswordsRepository',
  UsersPasswordsRepository,
);

container.registerSingleton<IUsersSessionsEventsRepository>(
  'UsersSessionsEventsRepository',
  UsersSessionsEventsRepository,
);

container.registerSingleton<IPasswordsForgotEventsRepository>(
  'PasswordsForgotEventsRepository',
  PasswordsForgotEventsRepository,
);

container.registerSingleton<IFinancialPasswordsEventsRepository>(
  'FinancialPasswordsEventsRepository',
  FinancialPasswordsEventsRepository,
);

container.registerSingleton<IUsersBitcoinWalletsRepository>(
  'UsersBitcoinWalletsRepository',
  UsersBitcoinWalletsRepository,
);
