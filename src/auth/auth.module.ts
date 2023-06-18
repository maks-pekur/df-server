import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseService } from 'src/firebase/firebase.service';

@Module({
  imports: [ConfigModule],
  providers: [FirebaseService],
})
export class AuthModule {}
