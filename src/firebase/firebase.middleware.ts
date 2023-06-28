// import {
//   HttpException,
//   HttpStatus,
//   Injectable,
//   NestMiddleware,
//   Scope,
// } from '@nestjs/common';
// import { NextFunction, Request, Response } from 'express';
// import { DecodedIdToken } from 'firebase-admin/auth';
// import { FirebaseService } from './firebase.service';

// @Injectable({ scope: Scope.DEFAULT })
// export class FirebaseMiddleware implements NestMiddleware {
//   public user: DecodedIdToken;
//   constructor(private firebase: FirebaseService) {}

//   async use(req: Request, res: Response, next: NextFunction): Promise<void> {
//     const { authorization } = req.headers;

//     if (!authorization) {
//       throw new HttpException(
//         'Missing authorization header',
//         HttpStatus.UNAUTHORIZED,
//       );
//     }

//     try {
//       const token = authorization.slice(7);
//       (req as any).user = await this.firebase.auth.verifyIdToken(token);
//       next();
//     } catch (error) {
//       throw new HttpException(
//         error.message || 'Unauthorized',
//         HttpStatus.UNAUTHORIZED,
//       );
//     }
//   }
// }
