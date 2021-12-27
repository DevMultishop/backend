import { MigrationInterface, QueryRunner } from 'typeorm';

export default class PopulatePlans1638364836172 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `insert into plans (name,usd_cents) values ('50 BLB',5000)`,
    );
    await queryRunner.query(
      `insert into plans (name,usd_cents) values ('200 BLB',20000)`,
    );
    await queryRunner.query(
      `insert into plans (name,usd_cents) values ('700 BLB',70000)`,
    );
    await queryRunner.query(
      `insert into plans (name,usd_cents) values ('1300 BLB',130000)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('delete from plans');
  }
}
