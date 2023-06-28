import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseMiddleware } from './firebase.middleware';
import { FirebaseService } from './firebase.service';

@Module({
  imports: [ConfigModule],
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {}
