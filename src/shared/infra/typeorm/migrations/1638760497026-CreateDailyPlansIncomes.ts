import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateDailyPlansIncomes1638760497026
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'plans_daily_incomes',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'year',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'month',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'day',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'value',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'date_formatted',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'applied',
            type: 'boolean',
            isNullable: false,
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
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('plans_daily_incomes');
  }
}
