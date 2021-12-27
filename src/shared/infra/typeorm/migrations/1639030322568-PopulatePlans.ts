import { MigrationInterface, QueryRunner } from 'typeorm';

export default class PopulatePlans1639030322568 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `insert into plans (name,usd_cents) values ('25 USD',2500)`,
    );
    await queryRunner.query(
      `insert into plans (name,usd_cents) values ('100 USD',10000)`,
    );
    await queryRunner.query(
      `insert into plans (name,usd_cents) values ('500 USD',50000)`,
    );
    await queryRunner.query(
      `insert into plans (name,usd_cents) values ('1000 USD',100000)`,
    );
    await queryRunner.query(
      `insert into plans (name,usd_cents) values ('3000 USD',300000)`,
    );
    await queryRunner.query(
      `insert into plans (name,usd_cents) values ('5000 USD',500000)`,
    );
    await queryRunner.query(
      `insert into plans (name,usd_cents) values ('10000 USD',1000000)`,
    );
    await queryRunner.query(
      `insert into plans (name,usd_cents) values ('20000 USD',2000000)`,
    );
    await queryRunner.query(
      `insert into plans (name,usd_cents) values ('30000 USD',3000000)`,
    );
    await queryRunner.query(
      `insert into plans (name,usd_cents) values ('50000 USD',5000000)`,
    );
    await queryRunner.query(
      `insert into plans (name,usd_cents) values ('100000 USD',10000000)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('delete from plans');
  }
}
