import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { credential } from 'firebase-admin';
import { App, initializeApp } from 'firebase-admin/app';
import { Auth, getAuth } from 'firebase-admin/auth';
import {
  CollectionReference,
  Firestore,
  getFirestore,
} from 'firebase-admin/firestore';
import { Storage, getStorage } from 'firebase-admin/storage';

@Injectable()
export class FirebaseService {
  private static initialized = false;
  public readonly app: App;
  public readonly auth: Auth;
  public readonly db: Firestore;
  public readonly storage: Storage;

  // Collections
  public customersCollection: CollectionReference;
  public productsCollection: CollectionReference;
  public storiesCollection: CollectionReference;
  public categoriesCollection: CollectionReference;
  public cartCollection: CollectionReference;
  public popularProductCollection: CollectionReference;
  public restaurantsCollection: CollectionReference;
  public ingredientsCollection: CollectionReference;
  public modifiersCollection: CollectionReference;
  public ordersCollection: CollectionReference;

  constructor(@Inject(ConfigService) private readonly config: ConfigService) {
    if (!FirebaseService.initialized) {
      this.app = initializeApp({
        credential: credential.cert({
          privateKey: this.config
            .get<string>('FIREBASE_PRIVATE_KEY')
            .replace(/\\n/g, '\n'),
          clientEmail: this.config.get<string>('FIREBASE_CLIENT_EMAIL'),
          projectId: this.config.get<string>('FIREBASE_PROJECT_ID'),
        }),
        databaseURL: this.config.get<string>('FIREBASE_DATABASE_URL'),
      });
      FirebaseService.initialized = true;
    }

    this.auth = getAuth(this.app);
    this.db = getFirestore(this.app);
    this.storage = getStorage(this.app);

    this._createCollections();
  }

  private _createCollections() {
    this.customersCollection = this.db.collection('customers');
    this.productsCollection = this.db.collection('products');
    this.storiesCollection = this.db.collection('stories');
    this.categoriesCollection = this.db.collection('categories');
    this.cartCollection = this.db.collection('cart');
    this.popularProductCollection = this.db.collection('populars');
    this.restaurantsCollection = this.db.collection('restaurants');
    this.ingredientsCollection = this.db.collection('ingredients');
    this.modifiersCollection = this.db.collection('modifiers');
    this.ordersCollection = this.db.collection('orders');
  }
}
