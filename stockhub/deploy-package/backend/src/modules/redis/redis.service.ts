import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Redis from 'ioredis';

@Injectable()
export class RedisService {
  private redis: Redis.Redis;

  constructor(private configService: ConfigService) {
    this.redis = new Redis({
      host: configService.get('REDIS_HOST', 'localhost') as string,
      port: parseInt(configService.get('REDIS_PORT', '6379') as string) as unknown as number,
      password: configService.get('REDIS_PASSWORD') as string | undefined,
      db: parseInt(configService.get('REDIS_DB', '0') as string) as unknown as number,
    });
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<'OK'> {
    if (ttl) {
      return this.redis.set(key, value, 'EX', ttl) as any;
    }
    return this.redis.set(key, value);
  }

  async del(key: string): Promise<number> {
    return this.redis.del(key);
  }
}
