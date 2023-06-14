import { Injectable } from '@nestjs/common';
import { FirebaseService } from './firebase/firebase.service';

@Injectable()
export class AppService {
  constructor(private firebaseService: FirebaseService) {}
  getMain(): any {
    return {
      name: 'delivery food api ',
      version: '0.0.1',
      description: 'An REST API with NESTJS and MONGODB',
      author: 'Max Pekur',
    };
  }
}
