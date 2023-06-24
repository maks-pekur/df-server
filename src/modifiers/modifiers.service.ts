import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { CreateModifierDto } from './dto/create-modifier.dto';
import { UpdateModifierDto } from './dto/update-modifier.dto';
import { Modifier } from './entities/modifire.entity';

@Injectable()
export class ModifiersService {
  constructor(private firebaseService: FirebaseService) {}

  async createModifier(
    createModifierDto: CreateModifierDto,
  ): Promise<Modifier> {
    const currentTime = new Date();
    const modifierData = {
      createdAt: currentTime,
      updatedAt: currentTime,
      ...createModifierDto,
    };

    const modifierRef = this.firebaseService.modifiersCollection.doc();
    await modifierRef.set(modifierData);

    const modifier = await modifierRef.get();

    return {
      id: modifier.id,
      ...modifier.data(),
    } as Modifier;
  }

  async getModifier(id: string): Promise<Modifier> {
    const doc = await this.firebaseService.modifiersCollection.doc(id).get();

    if (!doc.exists) {
      throw new NotFoundException('Modifier not found');
    }

    return {
      id: doc.id,
      ...doc.data(),
    } as Modifier;
  }

  async updateModifier(
    id: string,
    updateModifierDto: UpdateModifierDto,
  ): Promise<Modifier> {
    const updatedData = {
      ...updateModifierDto,
      updatedAt: new Date(),
    };

    const modifierRef = this.firebaseService.modifiersCollection.doc(id);
    await modifierRef.update(updatedData);

    const updatedDoc = await modifierRef.get();

    return {
      id: updatedDoc.id,
      ...updatedDoc.data(),
    } as Modifier;
  }

  async removeModifier(id: string): Promise<void> {
    const docRef = this.firebaseService.modifiersCollection.doc(id);
    await docRef.delete();
  }
}
