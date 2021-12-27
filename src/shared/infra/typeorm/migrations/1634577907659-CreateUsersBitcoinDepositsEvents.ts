import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateUsersBitcoinDepositsEvents1634577907659
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users_bitcoin_deposits_events',
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
          },
          {
            name: 'address',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'usd_cents',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'satoshis',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'btc_usd_conversion',
            type: 'decimal',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp with time zone',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            name: 'user-bitcoin_deposit_event',
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
    await queryRunner.dropTable('users_bitcoin_deposits_events');
  }
}
