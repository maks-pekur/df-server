// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-firebase-jwt';
// import { FirebaseService } from './firebase.service';

// @Injectable()
// export class FirebaseAuthStrategy extends PassportStrategy(
//   Strategy,
//   'firebase-auth',
// ) {
//   constructor(private firebaseService: FirebaseService) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//     });
//   }

//   async validate(token: string) {
//     try {
//       return await this.firebaseService.auth.verifyIdToken(token);
//     } catch (err) {
//       throw new UnauthorizedException();
//     }
//   }
// }
