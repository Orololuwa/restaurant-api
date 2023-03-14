require('dotenv').config();
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions =
  process.env.NODE_ENV === 'production'
    ? {
        synchronize: false,
        type: 'postgres',
        url: process.env.DATABASE_URL,
        entities: ['dist/**/**/*.entity.js'],
        migrations: ['dist/db/migrations/*.js'],
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : process.env.NODE_ENV === 'test'
    ? {
        synchronize: false,
        type: 'sqlite',
        database: 'test.sqlite',
        entities: ['dist/**/**/*.entity.ts'],
        migrations: ['dist/db/migrations/*.js'],
        migrationsRun: true,
      }
    : {
        synchronize: false,
        type: 'sqlite',
        database: 'dev.sqlite',
        entities: ['dist/**/**/*.entity.js'],
        migrations: ['dist/db/migrations/*.js'],
      };

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
