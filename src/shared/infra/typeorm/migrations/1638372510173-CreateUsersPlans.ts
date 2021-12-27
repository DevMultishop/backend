import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateUsersPlans1638372510173
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users_plans',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'plan_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'limit_usd_cents',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'progress_usd_cents',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'filled_at',
            type: 'timestamp with time zone',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp with time zone',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp with time zone',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            name: 'user_plan-user',
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            columnNames: ['user_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
          {
            name: 'user_plan-plan',
            referencedTableName: 'plans',
            referencedColumnNames: ['id'],
            columnNames: ['plan_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users_plans');
  }
}
