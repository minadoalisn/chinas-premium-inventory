import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            clientType?: 'domestic' | 'overseas';
            clientIP?: string;
            clientCountry?: string;
        }
    }
}
export declare class ClientTypeMiddleware implements NestMiddleware {
    private readonly logger;
    use(req: Request, res: Response, next: NextFunction): void;
}
