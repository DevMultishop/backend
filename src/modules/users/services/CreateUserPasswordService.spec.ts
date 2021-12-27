import FakeUsersPasswordsRepository from '../repositories/fakes/FakeUsersPasswordsRepository';
import CreateUserPasswordService from './CreateUserPasswordService';
import FakeHashProvider from '../../../shared/container/providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersPasswordsRepository: FakeUsersPasswordsRepository;
let fakeHashProvider: FakeHashProvider;
let createUserPasswordService: CreateUserPasswordService;

describe('CreateUserService tests', () => {
  beforeEach(() => {
    fakeUsersPasswordsRepository = new FakeUsersPasswordsRepository();
    fakeHashProvider = new FakeHashProvider();

    createUserPasswordService = new CreateUserPasswordService(
      fakeUsersPasswordsRepository,

      fakeHashProvider,
    );
  });
  it('should create a user password', async () => {
    await expect(
      createUserPasswordService.execute({
        password: 'test',
        type: 'login',
        user_id: '1',
      }),
    ).resolves.toHaveProperty('id');
  });
});
