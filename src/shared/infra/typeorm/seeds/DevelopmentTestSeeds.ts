import 'reflect-metadata';
import 'dotenv/config';

import '../../../container';
import DbConnections from '../index';
import SignUpResolver from '../../../../modules/users/infra/graphql/resolvers/SignUpResolver';
import ProfileResolver from '../../../../modules/users/infra/graphql/resolvers/ProfileResolver';
import PlansResolver from '../../../../modules/users/infra/graphql/resolvers/PlansResolver';
import WithdrawalResolver from '../../../../modules/users/infra/graphql/resolvers/WithdrawalResolver';
import EmailsVerificationEventsRepository from '../../../../modules/users/infra/typeorm/repositories/EmailsVerificationEventsRepository';
import FinancialPasswordsEventsRepository from '../../../../modules/users/infra/typeorm/repositories/FinancialPasswordsEventsRepository';
import UsersRepository from '../../../../modules/users/infra/typeorm/repositories/UsersRepository';
import UsersBalancesRepository from '../../../../modules/balances/infra/typeorm/repositories/UsersBalancesRepository';
import User from '../../../../modules/users/infra/typeorm/entities/User';

interface ICreateUser {
  username: string;
  phone_number: string;
  password: string;
  email: string;
  full_name: string;
  indicator_username: string;
}

const singUpResolver = new SignUpResolver();
const profileResolver = new ProfileResolver();
const plansResolver = new PlansResolver();
const withdrawalResolver = new WithdrawalResolver();

const doMigrations = async (): Promise<void> => {
  const [connection] = await DbConnections;
  if (!connection) return;

  await connection.runMigrations();

  await connection.undoLastMigration();
  await connection.undoLastMigration();
  await connection.undoLastMigration();
  await connection.undoLastMigration();
  await connection.undoLastMigration();
  await connection.undoLastMigration();
  await connection.undoLastMigration();
  await connection.undoLastMigration();
  await connection.undoLastMigration();
  await connection.undoLastMigration();

  await connection.undoLastMigration();
  await connection.undoLastMigration();
  await connection.undoLastMigration();
  await connection.undoLastMigration();
  await connection.undoLastMigration();
  await connection.undoLastMigration();
  await connection.undoLastMigration();
  await connection.undoLastMigration();
  await connection.undoLastMigration();
  await connection.undoLastMigration();

  // await connection.undoLastMigration();
  // await connection.undoLastMigration();
  // await connection.undoLastMigration();
  // await connection.undoLastMigration();
  // await connection.undoLastMigration();
  // await connection.undoLastMigration();

  console.log(await connection.runMigrations());
};

const createUser = async ({
  email,
  full_name,
  password,
  username,
  indicator_username,
  phone_number,
}: ICreateUser): Promise<User | undefined> => {
  const indicator = await singUpResolver.getValidIndicatorByUsername(
    indicator_username,
  );
  await singUpResolver.sendEmailVerificationToken(
    email,
    full_name,
    indicator.id,
  );
  const token = await new EmailsVerificationEventsRepository().findByEmail(
    email,
  );
  // eslint-disable-next-line no-console
  console.log(
    await singUpResolver.createUser(
      token?.id || '',
      username,
      phone_number,
      password,
    ),
  );

  const user = await new UsersRepository().findByUsername(username);
  await profileResolver.sendFinancialPasswordEmail(user?.id || '');
  const code = await new FinancialPasswordsEventsRepository().findByEmail(
    user?.email || '',
  );
  await profileResolver.createOrUpdateMyFinancialPassword(
    user?.id || '',
    code?.id || '',
    '11111111',
  );
  const usersRepository = new UsersBalancesRepository();
  const creditBalance = await usersRepository.create({
    card: 'credit',
    user_id: user?.id || '',
  });
  creditBalance.usd_cents = 100000;
  await usersRepository.save(creditBalance);

  const availableBalance = await usersRepository.create({
    card: 'available',
    user_id: user?.id || '',
  });
  availableBalance.usd_cents = 100000;
  await usersRepository.save(availableBalance);

  const plans = await plansResolver.getPlans();

  await plansResolver.createMyPlan(plans[1].id, '11111111', user?.id || '');

  await profileResolver.createOrUpdateMyBitcoinWallet(
    user?.id || '',
    'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    '11111111',
  );

  await withdrawalResolver.createBitcoinWithdrawal(
    user?.id || '',
    100,
    '11111111',
  );

  return user;
};

const seedUsers = async (): Promise<void> => {
  await createUser({
    username: 'a',
    email: 'a@email.com',
    indicator_username: 'nftgamepro',
    full_name: 'a',
    password: '11111111',
    phone_number: '(84) 9999-87654',
  });

  const users = ['b', 'c', 'd', 'e', 'f', 'g'];

  await Promise.all(
    users.map(user =>
      createUser({
        username: user,
        email: `${user}@email.com`,
        indicator_username: 'a',
        full_name: user,
        password: '11111111',
        phone_number: '(84) 9999-87654',
      }),
    ),
  );

  const users2 = ['b2', 'c2', 'd2', 'e2', 'f2', 'g2'];

  await Promise.all(
    users2.map(user =>
      createUser({
        username: user,
        email: `${user}@email.com`,
        indicator_username: 'b',
        full_name: user,
        password: '11111111',
        phone_number: '(84) 9999-87654',
      }),
    ),
  );

  // if (a) {
  //   await withdrawalResolver.createBitcoinWithdrawal(a.id, 100, '11111111');
  // }
};

const seed = async (): Promise<void> => {
  await doMigrations();
  await seedUsers();
};

seed();
