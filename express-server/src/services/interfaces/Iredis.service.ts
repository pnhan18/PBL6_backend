export interface IRedisService {
    set(key: string, value: string, ttl?: number): Promise<void>;
    get(key: string): Promise<string | null>;
    del(key: string): Promise<void>;
    exists(key: string): Promise<boolean>;
    hset(hash: string, field: string, value: string): Promise<void>;
    hget(hash: string, field: string): Promise<string | null>;
    hdel(hash: string, field: string): Promise<void>;
}
  