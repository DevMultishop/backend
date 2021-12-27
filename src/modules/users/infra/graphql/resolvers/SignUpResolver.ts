import { container } from 'tsyringe';
import { Arg, Query, Resolver, Mutation } from 'type-graphql';
import CheckUserAdminService from '../../../services/CheckUserAdminService';
import GetEmailVerificationEventService from '../../../services/GetEmailVerificationEventService';
import CreateEmailVerificationEventService from '../../../services/CreateEmailVerificationEventService';
import GetIndicatorService from '../../../services/GetIndicatorService';
import User from '../../typeorm/entities/User';
import CreateUserService from '../../../services/CreateUserService';
import CreateUserPasswordService from '../../../services/CreateUserPasswordService';
import CreateUserSessionService from '../../../services/CreateUserSessionService';
import CreateUnilevelNodeService from '../../../../unilevel/services/CreateUnilevelNodeService';
import UserSessionEvent from '../../typeorm/entities/UserSessionEvent';
import CreatePasswordForgotEventService from '../../../services/CreatePasswordForgotEventService';
import ResetLoginPasswordService from '../../../services/ResetLoginPasswordService';

@Resolver()
class SignupResolver {
  @Query(() => User)
  async getValidIndicatorByUsername(
    @Arg('username') username: string,
  ): Promise<User> {
    const getIndicatorService = container.resolve(GetIndicatorService);
    const user = await getIndicatorService.execute(username);
    return user;
  }

  @Mutation(() => String)
  async sendEmailVerificationToken(
    @Arg('email') email: string,
    @Arg('full_name') full_name: string,
    @Arg('indicator_id') indicator_id: string,
  ): Promise<string> {
    const createEmailVerificationEventService = container.resolve(
      CreateEmailVerificationEventService,
    );
    await createEmailVerificationEventService.execute({
      email,
      full_name,
      indicator_id,
    });

    return 'Access your email and copy the verification code to continue with the registration';
  }

  @Mutation(() => String)
  async createUser(
    @Arg('email_verification_id') email_verification_id: string,
    @Arg('username') username: string,
    @Arg('phone_number') phone_number: string,
    @Arg('password') password: string,
  ): Promise<string> {
    const getEmailVerificationEventService = container.resolve(
      GetEmailVerificationEventService,
    );
    const { email, indicator_id, full_name } =
      await getEmailVerificationEventService.execute(email_verification_id);

    const createUserService = container.resolve(CreateUserService);
    const user = await createUserService.execute({
      full_name,
      email,
      phone_number,
      username,
    });

    const createUserPasswordService = container.resolve(
      CreateUserPasswordService,
    );
    await createUserPasswordService.execute({
      password,
      type: 'login',
      user_id: user.id,
    });

    const createUnilevelNodeService = container.resolve(
      CreateUnilevelNodeService,
    );
    await createUnilevelNodeService.execute({
      indicator_id,
      user_id: user.id,
    });

    return 'Account successfully created';
  }

  @Mutation(() => UserSessionEvent)
  async createUserSession(
    @Arg('password') password: string,
    @Arg('username') username: string,
  ): Promise<UserSessionEvent> {
    const createUserSessionService = container.resolve(
      CreateUserSessionService,
    );
    return createUserSessionService.execute(username, password);
  }

  @Mutation(() => UserSessionEvent)
  async createAdminSession(
    @Arg('password') password: string,
    @Arg('username') username: string,
  ): Promise<UserSessionEvent> {
    const createUserSessionService = container.resolve(
      CreateUserSessionService,
    );
    const session = await createUserSessionService.execute(username, password);
    await container.resolve(CheckUserAdminService).execute(session.user_id);
    return session;
  }

  @Mutation(() => String)
  async sendForgotPasswordEmail(@Arg('email') email: string): Promise<string> {
    const createPasswordForgotEventService = container.resolve(
      CreatePasswordForgotEventService,
    );
    return createPasswordForgotEventService.execute(email);
  }

  @Mutation(() => String)
  async resetUserLoginPassword(
    @Arg('password') password: string,
    @Arg('verification_code') verification_code: string,
  ): Promise<string> {
    const resetLoginPasswordService = container.resolve(
      ResetLoginPasswordService,
    );
    return resetLoginPasswordService.execute(verification_code, password);
  }
}

export default SignupResolver;
