import { container } from 'tsyringe';
import { Resolver, UseMiddleware, Ctx, Arg, Mutation } from 'type-graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import CreateBankDepositService from '../../../../bankDeposits/services/CreateBankDepositService';
import EnsureIsUser from '../middlewares/EnsureIsUser';
import SaveFileToTmpFolder from '../../../../../shared/container/providers/StorageProvider/middlewares/SaveFileTmpFolder';
import VerifyFinancialPasswordService from '../../../services/VerifyFinancialPasswordService';

@Resolver()
class BankDepositResolver {
  @Mutation(() => String)
  @UseMiddleware(EnsureIsUser)
  async createUserBankDeposit(
    @Arg('comprovant', () => GraphQLUpload) comprovant: FileUpload,
    @Ctx('user_id') user_id: string,
    @Arg('usd_cents') usd_cents: number,
    @Arg('financial_password') financial_password: string,
  ): Promise<string> {
    await container
      .resolve(VerifyFinancialPasswordService)
      .execute({ user_id, password: financial_password });
    const saveFileToTmpFolder = new SaveFileToTmpFolder();
    const file_name = await saveFileToTmpFolder.execute(comprovant);
    await container
      .resolve(CreateBankDepositService)
      .execute({ usd_cents, user_id, deposit_slip: file_name });

    return 'Success, await for confirmation';
  }
}
export default BankDepositResolver;
