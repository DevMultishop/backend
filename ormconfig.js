require('dotenv').config();

module.exports = [
  {
    name: 'default',
    type: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    migrationsTableName: 'typeorm_migrations',
    entities: [
      './dist/modules/**/infra/typeorm/entities/*.js',
    ],
    migrations: [
      './dist/shared/infra/typeorm/migrations/*.js',
    ],
    cli: {
      migrationsDir:  process.env.NODE_ENV === 'development'
      ? './src/shared/infra/typeorm/migrations'
      : './dist/shared/infra/typeorm/migrations'
    },
  },
];
