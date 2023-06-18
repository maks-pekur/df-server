import { Injectable, NotFoundException } from '@nestjs/common';
import { DocumentReference, DocumentSnapshot } from 'firebase-admin/firestore';
import { FirebaseService } from 'src/firebase/firebase.service';
import { CreateModifierDto } from './dto/create-modifire.dto';

@Injectable()
export class ModifiersService {
  constructor(private firebaseService: FirebaseService) {}

  async createModifier(body: CreateModifierDto): Promise<void> {
    try {
      await this.firebaseService.db.collection('modifiers').add(body);
    } catch (error) {
      throw new NotFoundException('Modifier was not created');
    }
  }

  async updateModifier(
    modifierId: string,
    body: CreateModifierDto,
  ): Promise<void> {
    try {
      const modifierRef: DocumentReference = this.firebaseService.db
        .collection('modifiers')
        .doc(modifierId);
      await modifierRef.set(body);
    } catch (error) {
      throw new NotFoundException('Modifier was not updated');
    }
  }

  async getModifier(modifierId: string): Promise<any> {
    try {
      const modifierRef: DocumentReference = this.firebaseService.db
        .collection('modifiers')
        .doc(modifierId);
      const modifierDoc: DocumentSnapshot = await modifierRef.get();
      if (!modifierDoc.exists) {
        return null;
      }
      return modifierDoc.data();
    } catch (error) {
      throw new NotFoundException('Modifier not found');
    }
  }

  async deleteModifier(modifierId: string): Promise<void> {
    try {
      const modifierRef: DocumentReference = this.firebaseService.db
        .collection('modifiers')
        .doc(modifierId);
      await modifierRef.delete();
    } catch (error) {
      throw new NotFoundException('Modifier was not deleted');
    }
  }
}
