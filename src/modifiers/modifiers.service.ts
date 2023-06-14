import { Injectable, NotFoundException } from '@nestjs/common';
import { addDoc, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { FirebaseService } from 'src/firebase/firebase.service';
import { CreateModifierDto } from './dto/create-modifire.dto';

@Injectable()
export class ModifiersService {
  constructor(private firebaseService: FirebaseService) {}

  // async createModifierGroup(modifierGroup: ModifierGroup): Promise<string> {
  //   const modifierGroupRef = await this.firebaseService.create<ModifierGroup>(
  //     'modifierGroups',
  //     modifierGroup,
  //   );
  //   return modifierGroupRef.id;
  // }

  // async updateModifierGroup(
  //   modifierGroupId: string,
  //   modifierGroup: Partial<ModifierGroup>,
  // ): Promise<void> {
  //   await this.firebaseService.update<ModifierGroup>(
  //     'modifierGroups',
  //     modifierGroupId,
  //     modifierGroup,
  //   );
  // }

  // async getModifierGroup(modifierGroupId: string): Promise<ModifierGroup> {
  //   return this.firebaseService.get<ModifierGroup>(
  //     'modifierGroups',
  //     modifierGroupId,
  //   );
  // }

  // async deleteModifierGroup(modifierGroupId: string): Promise<void> {
  //   await this.firebaseService.delete('modifierGroups', modifierGroupId);
  // }

  async createModifier(body): Promise<void> {
    try {
      await addDoc(this.firebaseService.modifiersCollection, body);
    } catch (error) {
      throw new NotFoundException('Modifier does not create');
    }
  }

  async updateModifier(
    modifierId: string,
    body: CreateModifierDto,
  ): Promise<void> {
    try {
      const category = await setDoc(
        doc(this.firebaseService.modifiersCollection, modifierId),
        body,
      );
      return category;
    } catch (error) {
      throw new NotFoundException('Modifier does not update');
    }
  }

  async getModifier(modifierId: string) {
    try {
      const modifierDoc = await getDoc(
        doc(this.firebaseService.modifiersCollection, modifierId),
      );
      if (!modifierDoc.exists()) {
        return null;
      }
      return modifierDoc.data();
    } catch (error) {
      throw new NotFoundException('Modifier not found');
    }
  }

  async deleteModifier(modifierId: string): Promise<void> {
    try {
      await deleteDoc(
        doc(this.firebaseService.modifiersCollection, modifierId),
      );
    } catch (error) {
      throw new NotFoundException('Modifier not deleted');
    }
  }
}
