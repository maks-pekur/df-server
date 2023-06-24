import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getMain(): any {
    return {
      name: 'delivery food api ',
      version: '0.0.1',
      description: 'An REST API with NESTJS and FIREBASE',
      author: 'Maksym Pekur',
    };
  }
}
