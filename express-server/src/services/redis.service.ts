// src/services/RedisService.ts
import { IRedisService } from "./interfaces/Iredis.service";
import RedisInitializer from "../db/init.redis";
import { Redis } from "ioredis";
import { Service } from "typedi";

@Service()
export class RedisService implements IRedisService {
  private redisClient: Redis;

  constructor() {
    this.redisClient = RedisInitializer.getInstance().getClient;
  }

  async set(key: string, value: string, ttl: number = 3600): Promise<void> {
    await this.redisClient.setex(key, ttl, value);
  }

  async get(key: string): Promise<string | null> {
    return await this.redisClient.get(key);
  }

  async del(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.redisClient.exists(key);
    return result === 1;
  }

  async hset(hash: string, field: string, value: string): Promise<void> {
    await this.redisClient.hset(hash, field, value);
  }

  async hget(hash: string, field: string): Promise<string | null> {
    return await this.redisClient.hget(hash, field);
  }

  async hdel(hash: string, field: string): Promise<void> {
    await this.redisClient.hdel(hash, field);
  }
}
