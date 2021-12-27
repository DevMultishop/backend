import { container } from 'tsyringe';
import ICryptoProvider from './models/ICryptoProvider';
import Bitcoin from './implementations/Bitcoin';

container.registerSingleton<ICryptoProvider>('Bitcoin', Bitcoin);
