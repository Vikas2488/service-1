import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const startTime = Date.now();

    this.logger.log({
      Request: {
        method: request.method,
        url: request.originalUrl,
        headers: JSON.stringify(request.headers),
        body: JSON.stringify(request.body),
      },
    });

    response.on('finish', () => {
      const endTime = Date.now();
      const processingTime = endTime - startTime;

      this.logger.log({
        Response: {
          method: request.method,
          url: request.originalUrl,
          statusCode: response.statusCode,
          contentLength: response.get('content-length'),
          processingTime: `${processingTime}ms`,
        },
      });
    });

    next();
  }
}
