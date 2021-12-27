import { container } from 'tsyringe';

import mailConfig from '../../../../config/mail';

import IMailProvider from './models/IMailProvider';

import EtherealMailProvider from './implementations/EtherealMailProvider';
import GSuitMailProvider from './implementations/GSuitMailProvider';

const providers = {
  ethereal: container.resolve(EtherealMailProvider),
  gmail: container.resolve(GSuitMailProvider),
};

container.registerInstance<IMailProvider>(
  'MailProvider',
  providers[mailConfig.driver],
);

export default providers[mailConfig.driver];
