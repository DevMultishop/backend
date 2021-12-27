import { MigrationInterface, QueryRunner } from 'typeorm';

interface result {
  id: string;
}

export default class PopulateUsersAdmins1638840557069
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const result: result[] = await queryRunner.query(
      `select id from users where email='noreply@nftgamepro.io'`,
    );
    const user_id = result[0].id;
    await queryRunner.query(
      `INSERT INTO users_admins (user_id,is_active) values ('${user_id}',true)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM users_admins`);
  }
}
