import { MigrationInterface, QueryRunner } from 'typeorm';

export default class PopulatePlans1639030322568 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `insert into plans (name,usd_cents) values ('PRO',50000)`,
    );
    await queryRunner.query(
      `insert into plans (name,usd_cents) values ('PRIME',100000)`,
    );
    await queryRunner.query(
      `insert into plans (name,usd_cents) values ('SELECT',250000)`,
    );
    await queryRunner.query(
      `insert into plans (name,usd_cents) values ('PERSONALITE',500000)`,
    );
    await queryRunner.query(
      `insert into plans (name,usd_cents) values ('EXCLUSIVE',1500000)`,
    );
    await queryRunner.query(
      `insert into plans (name,usd_cents) values ('INVESTIDOR',2500000)`,
    );
    await queryRunner.query(
      `insert into plans (name,usd_cents) values ('GREAT INVESTIDOR',5000000)`,
    );
    // await queryRunner.query(
    //   `insert into plans (name,usd_cents) values ('50000 USD',5000000)`,
    // );
    // await queryRunner.query(
    //   `insert into plans (name,usd_cents) values ('100000 USD',10000000)`,
    // );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('delete from plans');
  }
}
