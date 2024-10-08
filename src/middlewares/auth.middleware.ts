import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor() {}

  async use(req: Request, res: Response, next: NextFunction) {
    let token = req.headers['authorization'];
    if (!token) {
      return res.status(401).send('Access denied. No token provided.');
    }

    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length).trim();
    }

    if (token !== process.env.ADMIN_SECRET_KEY) {
      return res.status(401).send('Access denied. Invalid token.');
    }
    next();
  }
}
