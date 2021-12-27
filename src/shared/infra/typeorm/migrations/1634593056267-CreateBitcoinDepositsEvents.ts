import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateBitcoinDepositsEvents1634593056267
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'bitcoin_deposits_events',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'address',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'txid',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'varchar',
            isNullable: false,
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
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('bitcoin_deposits_events');
  }
}
