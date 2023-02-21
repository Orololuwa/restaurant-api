import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions =
  process.env.NODE_ENV === 'production'
    ? {
        synchronize: false,
        type: 'postgres',
        url: process.env.DATABASE_URL,
        migrationsRun: true,
        entities: ['dist/**/**/*.entity.js'],
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

// switch (process.env.NODE_ENV) {
//   case 'development':
//     Object.assign(dataSourceOptions, {
//       type: 'sqlite',
//       database: 'db.sqlite',
//       entities: ['/dist/**/*.entity.js'],
//     });
//     break;
//   case 'test':
//     Object.assign(dataSourceOptions, {
//       type: 'sqlite',
//       database: 'test.sqlite',
//       entities: ['/dist/**/*.entity.ts'],
//       migrationsRun: true,
//     });
//     break;
//   case 'production':
//     break;
//   default:
//     throw new Error('unknown environment');
// }

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
