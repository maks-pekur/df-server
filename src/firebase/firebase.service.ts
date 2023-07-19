import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { credential } from 'firebase-admin';
import { App, initializeApp } from 'firebase-admin/app';
import {
  CollectionReference,
  Firestore,
  getFirestore,
} from 'firebase-admin/firestore';
import { Storage, getStorage } from 'firebase-admin/storage';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FirebaseService {
  private readonly logger: Logger;
  private static initialized = false;
  public readonly app: App;
  // public readonly auth: Auth;
  public readonly db: Firestore;
  public readonly storage: Storage;

  // Collections
  public customersCollection: CollectionReference;
  public productsCollection: CollectionReference;
  public storiesCollection: CollectionReference;
  public categoriesCollection: CollectionReference;
  public cartCollection: CollectionReference;
  public popularProductCollection: CollectionReference;
  public storesCollection: CollectionReference;
  public ingredientsCollection: CollectionReference;
  public ingredientGroupsCollection: CollectionReference;
  public modifiersCollection: CollectionReference;
  public modifierGroupsCollection: CollectionReference;
  public stopListCollection: CollectionReference;
  public ordersCollection: CollectionReference;

  constructor(@Inject(ConfigService) private readonly config: ConfigService) {
    this.logger = new Logger(FirebaseService.name);

    if (!FirebaseService.initialized) {
      this.app = initializeApp({
        credential: credential.cert({
          privateKey: this.config
            .get<string>('FIREBASE_PRIVATE_KEY')
            .replace(/\\n/g, '\n'),
          clientEmail: this.config.get<string>('FIREBASE_CLIENT_EMAIL'),
          projectId: this.config.get<string>('FIREBASE_PROJECT_ID'),
        }),
        storageBucket: this.config.get<string>('FIREBASE_STORAGE_BUCKET'),
        databaseURL: this.config.get<string>('FIREBASE_DATABASE_URL'),
      });
      FirebaseService.initialized = true;
    }

    // this.auth = getAuth(this.app);
    this.db = getFirestore(this.app);
    this.storage = getStorage(this.app);

    this._createCollections();
  }

  async uploadImage(
    file: Express.Multer.File,
    folder: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject('No image file');
      }

      const isValidImage = file.mimetype.startsWith('image/');
      if (!isValidImage) {
        reject('Invalid image format');
      }

      const newFileName = `${uuidv4()}.webp`;
      const newFileMimetype = 'image/webp';

      sharp(file.buffer)
        .webp()
        .toBuffer()
        .then((buffer) => {
          const bucket = this.storage.bucket();
          const fileUpload = bucket.file(`${folder}/${newFileName}`);
          const blobStream = fileUpload.createWriteStream({
            metadata: {
              contentType: newFileMimetype,
            },
          });

          blobStream.on('error', (error) => {
            this.logger.error(error);
            reject(
              'Something is wrong! Unable to upload at the moment.' + error,
            );
          });

          blobStream.on('finish', async () => {
            const url = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
            resolve(url);
          });

          blobStream.end(buffer);
        })
        .catch((error) => {
          this.logger.error(error);
          reject('Something went wrong when converting the image.' + error);
        });
    });
  }

  async deleteFileFromStorage(filePath: string): Promise<void> {
    try {
      const bucket = this.storage.bucket();
      await bucket.file(filePath).delete();
    } catch (error) {
      this.logger.warn(
        `Failed to delete file ${filePath} from Firebase Storage. Error: ${error.message}`,
      );
    }
  }

  getPathFromUrl(url: string): string {
    const bucket = this.storage.bucket();
    return url.replace(`https://storage.googleapis.com/${bucket.name}/`, '');
  }

  private _createCollections() {
    this.customersCollection = this.db.collection('customers');
    this.productsCollection = this.db.collection('products');
    this.storiesCollection = this.db.collection('stories');
    this.categoriesCollection = this.db.collection('categories');
    this.cartCollection = this.db.collection('cart');
    this.popularProductCollection = this.db.collection('populars');
    this.storesCollection = this.db.collection('stores');
    this.ingredientsCollection = this.db.collection('ingredients');
    this.ingredientGroupsCollection = this.db.collection('ingredients-group');
    this.modifiersCollection = this.db.collection('modifiers');
    this.modifierGroupsCollection = this.db.collection('modifiers-group');
    this.stopListCollection = this.db.collection('stop-list');
    this.ordersCollection = this.db.collection('orders');
  }
}
