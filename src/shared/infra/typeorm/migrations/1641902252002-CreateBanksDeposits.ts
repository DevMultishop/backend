import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateBanksDeposits1641902252002
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users_bank_deposits',
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
            name: 'usd_cents',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'deposit_slip',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'admin_answear',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar(20)',
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
        foreignKeys: [
          {
            name: 'user-bank_deposit',
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            columnNames: ['user_id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users_bank_deposits');
  }
}
