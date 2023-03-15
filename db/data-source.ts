require('dotenv').config();
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions =
  process.env.NODE_ENV === 'production'
    ? {
        synchronize: false,
        type: 'postgres',
        url: process.env.DATABASE_URL,
        entities: ['dist/**/**/**/*.entity.js'],
        migrations: ['dist/db/migrations/*.js'],
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : // : process.env.NODE_ENV === 'test'
    // ? {
    //     synchronize: false,
    //     type: 'sqlite',
    //     database: 'test.sqlite',
    //     entities: ['dist/**/**/*.entity.ts'],
    //     migrations: ['dist/db/migrations/*.js'],
    //     migrationsRun: true,
    //   }
    process.env.NODE_ENV === 'staging'
    ? {
        synchronize: false,
        type: 'mysql',
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        port: +process.env.DB_PORT,
        host: process.env.DB_HOST,
        database: 'burger_builder',
        entities: ['dist/**/**/**/*.entity.js'],
        migrations: ['dist/db/migrations/*.js'],
      }
    : process.env.NODE_ENV === 'development'
    ? {
        synchronize: false,
        type: 'postgres',
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        port: +process.env.DB_PORT,
        host: process.env.DB_HOST,
        database: 'burger_builder',
        entities: ['dist/**/**/**/*.entity.js'],
        migrations: ['dist/db/migrations/*.js'],
      }
    : {
        synchronize: true,
        type: 'sqlite',
        database: 'dev.sqlite',
        entities: ['dist/**/**/**/*.entity.js'],
      };

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
