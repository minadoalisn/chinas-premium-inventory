import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
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

@Injectable()
export class ClientTypeMiddleware implements NestMiddleware {
  private readonly logger = new Logger(ClientTypeMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    // 优先从请求头获取（Nginx/Cloudflare传递）
    const clientTypeHeader = req.headers['x-client-type'] as string;

    if (clientTypeHeader && ['domestic', 'overseas'].includes(clientTypeHeader)) {
      req.clientType = clientTypeHeader as 'domestic' | 'overseas';
      req.clientIP = req.headers['x-forwarded-for'] as string || req.ip;
      req.clientCountry = req.headers['x-client-country'] as string || 'Unknown';

      this.logger.debug(
        `Request from ${req.clientType} - IP: ${req.clientIP}, Country: ${req.clientCountry}`,
      );

      next();
      return;
    }

    // 备选方案：从Referer判断
    const referer = req.headers.referer || '';
    if (referer.includes('stockhub.cn')) {
      req.clientType = 'domestic';
    } else if (referer.includes('stockhub.com')) {
      req.clientType = 'overseas';
    } else {
      // 默认国内（根据文档，国内是C2求购为主）
      req.clientType = 'domestic';
    }

    req.clientIP = req.ip;
    req.clientCountry = 'Unknown';

    this.logger.debug(
      `Inferred client type: ${req.clientType} from referer: ${referer}`,
    );

    next();
  }
}
