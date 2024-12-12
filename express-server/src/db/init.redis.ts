import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

const statusConnectRedis = {
    CONNECT: 'connect',
    END: 'end',
    RECONNECT: 'reconnecting',
    ERROR: 'error',
}

class RedisInitializer {
  private client: Redis;
  private static instance: RedisInitializer;

  get getClient() {
    return this.client;
  }

  constructor() {
    this.client = new Redis(process.env.REDIS_URI as string);
    this.handleEventConnect();
  }

  handleEventConnect() {
    this.client.on(statusConnectRedis.CONNECT, () => {
      console.log('Redis connected');
    });
    this.client.on(statusConnectRedis.END, () => {
      console.log('Redis end');
    });
    this.client.on(statusConnectRedis.RECONNECT, () => {
      console.log('Redis reconnecting');
    });
    this.client.on(statusConnectRedis.ERROR, (err) => {
      console.log('Redis error', err);
    });
  }

  async close() {
    await this.client.quit();
  }

  static getInstance() {
    if (!RedisInitializer.instance) {
      RedisInitializer.instance = new RedisInitializer();
    }
    return RedisInitializer.instance;
  }
}

export default RedisInitializer;