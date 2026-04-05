import { ConfigService } from '@nestjs/config';
export declare class RedisService {
    private configService;
    private redis;
    constructor(configService: ConfigService);
    get(key: string): Promise<string | null>;
    set(key: string, value: string, ttl?: number): Promise<'OK'>;
    del(key: string): Promise<number>;
}
