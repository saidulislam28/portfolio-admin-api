/* eslint-disable */
import { join } from 'path';

export const dbConfig = () => ({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.NODE_ENV == 'development' ? false : { rejectUnauthorized: false },
  entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
  // We are using migrations, synchronize should be set to false.
  synchronize: true, //TODO set it to true only on dev
  dropSchema: false,
  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
  migrationsRun: false,
  logging: false,
  migrations: [join(__dirname, '../migrations/**/*{.ts,.js}')],
  /*cli: {
    migrationsDir: join(__dirname, '../migrations'),
    entitiesDir: join(__dirname, '../!**!/!*.entity{.ts,.js}'),
  },*/
});

export default dbConfig();
