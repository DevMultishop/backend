import FakeUsersPasswordsRepository from '../repositories/fakes/FakeUsersPasswordsRepository';
import FakeHashProvider from '../../../shared/container/providers/HashProvider/fakes/FakeHashProvider';
import VerifyFinancialPasswordService from './VerifyFinancialPasswordService';

let fakeUsersPasswordsRepository: FakeUsersPasswordsRepository;
let fakeHashProvider: FakeHashProvider;
let verifyFinancialPasswordService: VerifyFinancialPasswordService;

describe('VerifyFinancialPasswordService tests', () => {
  beforeEach(() => {
    fakeHashProvider = new FakeHashProvider();
    fakeUsersPasswordsRepository = new FakeUsersPasswordsRepository();
    verifyFinancialPasswordService = new VerifyFinancialPasswordService(
      fakeUsersPasswordsRepository,
      fakeHashProvider,
    );
  });
  it('should throw an error about password not found', async () => {
    await expect(
      verifyFinancialPasswordService.execute({
        password: 'test',
        user_id: '1',
      }),
    ).rejects.toHaveProperty('message', 'Senha nao encontrada');
  });
  it('should throw an error about wrong password', async () => {
    await fakeUsersPasswordsRepository.create({
      user_id: '1',
      password_hash: '12345678',
      type: 'financial',
    });
    await expect(
      verifyFinancialPasswordService.execute({
        password: 'test',
        user_id: '1',
      }),
    ).rejects.toHaveProperty('message', 'Senha incorreta');
  });
  it('shouldshould return true', async () => {
    await fakeUsersPasswordsRepository.create({
      user_id: '1',
      password_hash: '12345678',
      type: 'financial',
    });
    await expect(
      verifyFinancialPasswordService.execute({
        password: '12345678',
        user_id: '1',
      }),
    ).resolves.toBe(true);
  });
});
