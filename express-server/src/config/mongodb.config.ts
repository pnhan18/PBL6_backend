import dotenv from 'dotenv';
dotenv.config();

class MongoDBConfig {
  app: { port: number };
  db: { host: string; username?: string; password?: string; port: number; name: string };

  constructor() {
    this.app = {
      port: Number(process.env.APP_PORT || 3000),
    };

    this.db = {
      host: process.env.DB_HOST || 'localhost',
      username: process.env.DB_USERNAME || '',
      password: process.env.DB_PASSWORD || '',
      port: Number(process.env.DB_PORT || 5432),
      name: process.env.DB_NAME || 'default',
    };
  }
}

class DevConfig extends MongoDBConfig {
  constructor() {
    super();
    this.db = {
      ...this.db,
      username: process.env.DEV_DB_USERNAME || 'postgres',
      password: process.env.DEV_DB_PASSWORD || '',
      name: process.env.DEV_DB_NAME || 'dev',
    };
  }
}

class ProConfig extends MongoDBConfig {
  constructor() {
    super();
    this.db = {
      ...this.db,
      port: Number(process.env.PRO_DB_PORT || 27017),
      name: process.env.PRO_DB_NAME || 'prod',
    };
  }
}

const config = process.env.NODE_ENV === 'production' ? new ProConfig() : new DevConfig();
export default config;
