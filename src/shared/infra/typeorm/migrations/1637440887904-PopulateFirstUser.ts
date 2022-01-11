import { MigrationInterface, QueryRunner } from 'typeorm';

export default class PopulateFirstUser1637440887904
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.query(
      `insert into users (full_name,username,phone_number,email) values ('multishop','multishop','(84)99999-9999','multishopsistemas@gmail.com')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('delete from users');
  }
}
