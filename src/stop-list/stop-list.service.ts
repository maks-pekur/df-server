import { Injectable, Logger } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { StopListItemDto } from './dto/stop-list-item.dto';

@Injectable()
export class StopListService {
  private readonly logger: Logger;
  constructor(private firebaseService: FirebaseService) {
    this.logger = new Logger(StopListService.name);
  }

  async addToStopList(item: StopListItemDto) {
    const docRef = this.firebaseService.stopListCollection.doc('list');
    const doc = await docRef.get();
    let data = doc.data();

    if (!data) {
      data = {
        productUUIDs: [],
        toppingUUIDs: [],
      };
    }

    if (item.type === 'product') {
      data.productUUIDs.push(item.id);
    } else if (item.type === 'ingredient') {
      data.toppingUUIDs.push(item.id);
    }

    await docRef.set(data);
  }

  async removeFromStopList(item: StopListItemDto) {
    const docRef = this.firebaseService.stopListCollection.doc('list');
    const doc = await docRef.get();
    const data = doc.data();

    if (item.type === 'product') {
      data.productUUIDs = data.productUUIDs.filter((uuid) => uuid !== item.id);
    } else if (item.type === 'ingredient') {
      data.toppingUUIDs = data.toppingUUIDs.filter((uuid) => uuid !== item.id);
    }

    await docRef.set(data);
  }

  async getStopList() {
    const docRef = this.firebaseService.stopListCollection.doc('list');
    const doc = await docRef.get();
    return doc.data() ?? { productUUIDs: [], toppingUUIDs: [] };
  }
}
