import { container } from 'tsyringe';
import {
  Resolver,
  Query,
  UseMiddleware,
  Ctx,
  Mutation,
  Arg,
} from 'type-graphql';
import UpdateUserProfileService from '../../../services/UpdateUserProfileService';
import UpdateUserLoginPasswordService from '../../../services/UpdateUserLoginPasswordService';
import UpdateUserBitcoinWalletService from '../../../services/UpdateUserBitcoinWalletService';
import GetMeService from '../../../services/GetMeService';
import UpdateUserFinancialPasswordService from '../../../services/UpdateUserFinancialPasswordService';
import CreateFinancialPasswordEventService from '../../../services/CreateFinancialPasswordEventService';
import CheckFinancialPasswordService from '../../../services/CheckFinancialPasswordService';
import User from '../../typeorm/entities/User';
import EnsureIsUser from '../middlewares/EnsureIsUser';
import GetMyIndicationlinkService from '../../../services/GetMyIndicationlinkService';
import VerifyFinancialPasswordService from '../../../services/VerifyFinancialPasswordService';

@Resolver()
class ProfileResolver {
  @Query(() => User)
  @UseMiddleware(EnsureIsUser)
  async getMe(@Ctx('user_id') user_id: string): Promise<User> {
    const getMeService = container.resolve(GetMeService);
    return getMeService.execute(user_id);
  }

  @Query(() => String)
  @UseMiddleware(EnsureIsUser)
  async getMyIndicationLink(@Ctx('user_id') user_id: string): Promise<string> {
    return container.resolve(GetMyIndicationlinkService).execute({ user_id });
  }

  @Query(() => Boolean)
  @UseMiddleware(EnsureIsUser)
  async getHasFinancialPassword(
    @Ctx('user_id') user_id: string,
  ): Promise<boolean> {
    const checkFinancialPasswordService = container.resolve(
      CheckFinancialPasswordService,
    );
    return checkFinancialPasswordService.execute(user_id);
  }

  @Mutation(() => String)
  @UseMiddleware(EnsureIsUser)
  async sendFinancialPasswordEmail(
    @Ctx('user_id') user_id: string,
  ): Promise<string> {
    const createFinancialPasswordEventService = container.resolve(
      CreateFinancialPasswordEventService,
    );
    return createFinancialPasswordEventService.execute(user_id);
  }

  @Mutation(() => String)
  @UseMiddleware(EnsureIsUser)
  async createOrUpdateMyFinancialPassword(
    @Ctx('user_id') user_id: string,
    @Arg('verification_code') verification_code: string,
    @Arg('password') password: string,
  ): Promise<string> {
    const updateUserFinancialPasswordService = container.resolve(
      UpdateUserFinancialPasswordService,
    );
    return updateUserFinancialPasswordService.execute(
      user_id,
      verification_code,
      password,
    );
  }

  @Mutation(() => String)
  @UseMiddleware(EnsureIsUser)
  async createOrUpdateMyBitcoinWallet(
    @Ctx('user_id') user_id: string,
    @Arg('address') address: string,
    @Arg('financial_password') financial_password: string,
  ): Promise<string> {
    await container
      .resolve(VerifyFinancialPasswordService)
      .execute({ user_id, password: financial_password });
    await container.resolve(UpdateUserBitcoinWalletService).execute({
      address,
      user_id,
    });
    return 'Successfully updated';
  }

  @Mutation(() => String)
  @UseMiddleware(EnsureIsUser)
  async updateMyProfile(
    @Ctx('user_id') user_id: string,
    @Arg('phone_number') phone_number: string,
    @Arg('full_name') full_name: string,
    @Arg('financial_password') financial_password: string,
    @Arg('password', { nullable: true }) password?: string,
  ): Promise<string> {
    await container
      .resolve(VerifyFinancialPasswordService)
      .execute({ user_id, password: financial_password });

    await container.resolve(UpdateUserProfileService).execute({
      full_name,
      phone_number,
      user_id,
    });

    if (password)
      await container
        .resolve(UpdateUserLoginPasswordService)
        .execute({ user_id, password });

    return 'Successfully updated';
  }
}
export default ProfileResolver;
