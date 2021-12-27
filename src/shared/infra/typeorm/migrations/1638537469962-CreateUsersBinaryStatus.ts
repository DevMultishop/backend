import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateUsersBinaryStatus1638537469962
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users_binary_status',
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
            name: 'left_points',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'right_points',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'bonus_usd_cents',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'max_usd_cents',
            type: 'bigint',
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
            name: 'user-user_binary_status',
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
    await queryRunner.dropTable('users_binary_status');
  }
}
