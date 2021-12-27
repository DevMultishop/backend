import FakeUsersPasswordsRepository from '../repositories/fakes/FakeUsersPasswordsRepository';
import CheckFinancialPasswordService from './CheckFinancialPasswordService';

let fakeUsersPasswordsRepository: FakeUsersPasswordsRepository;
let checkFinancialPasswordService: CheckFinancialPasswordService;

describe('CheckFinancialPasswordService tests', () => {
  beforeEach(() => {
    fakeUsersPasswordsRepository = new FakeUsersPasswordsRepository();

    checkFinancialPasswordService = new CheckFinancialPasswordService(
      fakeUsersPasswordsRepository,
    );
  });
  it('should return false', async () => {
    await expect(
      checkFinancialPasswordService.execute('user_id'),
    ).resolves.toBe(false);
  });
  it('should return true', async () => {
    await fakeUsersPasswordsRepository.create({
      password_hash: 'hash',
      type: 'financial',
      user_id: 'user_id',
    });
    await expect(
      checkFinancialPasswordService.execute('user_id'),
    ).resolves.toBe(true);
  });
});
