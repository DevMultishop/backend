import { MigrationInterface, QueryRunner } from 'typeorm';
import BCryptHashProvider from '../../../container/providers/HashProvider/implementations/BCryptHashProvider';

interface result {
  id: string;
}
export default class PopulateBinaryNodeFirstUser1638386183288
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const result: result[] = await queryRunner.query(
      `select id from users where email='noreply@nftgamepro.io'`,
    );
    const user_id = result[0].id;
    await queryRunner.query(
      `INSERT INTO binary_nodes (user_id,position,depth) values ('${user_id}','left',0)`,
    );
    await queryRunner.query(
      `INSERT INTO users_passwords (user_id,password_hash,type) values ('${user_id}','${new BCryptHashProvider().generateHash(
        '12345678',
      )}','login')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM users_passwords`);
    await queryRunner.query(`DELETE FROM binary_nodes`);
  }
}
