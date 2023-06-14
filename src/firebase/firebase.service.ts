import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import {
  CollectionReference,
  Firestore,
  collection,
  getFirestore,
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { Config } from 'src/common/config.model';

@Injectable()
export class FirebaseService {
  public app: FirebaseApp;
  public auth: Auth;
  public db: Firestore;
  public storage: any;

  // Collections
  public usersCollection: CollectionReference;
  public productsCollection: CollectionReference;
  public storiesCollection: CollectionReference;
  public categoriesCollection: CollectionReference;
  public cartCollection: CollectionReference;
  public popularProductCollection: CollectionReference;
  public restaurantsCollection: CollectionReference;
  public ingredientsCollection: CollectionReference;
  public modifiersCollection: CollectionReference;

  constructor(private configService: ConfigService<Config>) {
    this.app = initializeApp({
      apiKey: configService.get<string>('API_KEY'),
      appId: configService.get<string>('APP_ID'),
      authDomain: configService.get<string>('AUTH_DOMAIN'),
      measurementId: configService.get<string>('MEASUREMENT_ID'),
      messagingSenderId: configService.get<string>('MESSAGING_SENDER_ID'),
      projectId: configService.get<string>('PROJECT_ID'),
      storageBucket: configService.get<string>('STORAGE_BUCKET'),
    });

    this.auth = getAuth(this.app);
    this.db = getFirestore(this.app);
    this.storage = getStorage(this.app);

    this._createCollections();
  }

  private _createCollections() {
    this.usersCollection = collection(this.db, 'users');
    this.productsCollection = collection(this.db, 'products');
    this.storiesCollection = collection(this.db, 'stories');
    this.categoriesCollection = collection(this.db, 'categories');
    this.cartCollection = collection(this.db, 'cart');
    this.popularProductCollection = collection(this.db, 'populars');
    this.restaurantsCollection = collection(this.db, 'restaurants');
    this.ingredientsCollection = collection(this.db, 'ingredients');
    this.modifiersCollection = collection(this.db, 'modifiers');
  }
}
