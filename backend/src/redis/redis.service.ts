import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private redisClient: Redis;
  private readonly logger = new Logger(RedisService.name);
  private isConnected = false;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const redisUrl = this.configService.get<string>('REDIS_URL');
    if (!redisUrl) {
      this.logger.warn('REDIS_URL not configured. Redis caching will be skipped.');
      return;
    }

    this.redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        if (times > 3) {
          this.logger.warn('Redis connection failed, giving up.');
          return null;
        }
        return Math.min(times * 50, 2000);
      },
    });

    this.redisClient.on('connect', () => {
      this.logger.log('Connected to Redis');
      this.isConnected = true;
    });

    this.redisClient.on('error', (err) => {
      this.logger.error(`Redis error: ${err.message}`);
      this.isConnected = false;
    });
  }

  onModuleDestroy() {
    if (this.redisClient) {
      this.redisClient.disconnect();
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.isConnected || !this.redisClient) return null;
    try {
      const data = await this.redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      this.logger.error(`Error getting key ${key} from Redis`, error);
      return null;
    }
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    if (!this.isConnected || !this.redisClient) return;
    try {
      const stringValue = JSON.stringify(value);
      if (ttlSeconds) {
        await this.redisClient.set(key, stringValue, 'EX', ttlSeconds);
      } else {
        await this.redisClient.set(key, stringValue);
      }
    } catch (error) {
      this.logger.error(`Error setting key ${key} in Redis`, error);
    }
  }

  async del(key: string): Promise<void> {
    if (!this.isConnected || !this.redisClient) return;
    try {
      await this.redisClient.del(key);
    } catch (error) {
      this.logger.error(`Error deleting key ${key} from Redis`, error);
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!this.isConnected || !this.redisClient) return false;
    try {
      const count = await this.redisClient.exists(key);
      return count > 0;
    } catch (error) {
      this.logger.error(`Error checking existence of key ${key} in Redis`, error);
      return false;
    }
  }
}
