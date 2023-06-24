import { BadRequestException, Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { CreateModifierGroupDto } from './dto/create-modifier-group.dto';
import { UpdateModifierGroupDto } from './dto/update-modifier-group.dto';
import { ModifierGroup } from './entities/modifire.entity';

@Injectable()
export class ModifierGroupsService {
  constructor(private firebaseService: FirebaseService) {}

  async createModifierGroup(
    createModifierGroupDto: CreateModifierGroupDto,
  ): Promise<ModifierGroup> {
    const currentTime = new Date();

    const modifierGroupData = {
      ...createModifierGroupDto,
      createdAt: currentTime,
      updatedAt: currentTime,
    };

    const modifierGroupRef =
      this.firebaseService.modifierGroupsCollection.doc();
    await modifierGroupRef.set(modifierGroupData);

    const doc = await modifierGroupRef.get();

    return {
      id: doc.id,
      ...modifierGroupData,
    } as ModifierGroup;
  }

  async getModifierGroup(id: string): Promise<ModifierGroup> {
    const doc = await this.firebaseService.modifierGroupsCollection
      .doc(id)
      .get();

    if (!doc.exists) {
      throw new BadRequestException('Modifier group not found');
    }

    return {
      id: doc.id,
      ...doc.data(),
    } as ModifierGroup;
  }

  async updateModifierGroup(
    id: string,
    updateModifierGroupDto: UpdateModifierGroupDto,
  ): Promise<ModifierGroup> {
    const docRef = this.firebaseService.modifierGroupsCollection.doc(id);
    await docRef.update({
      ...updateModifierGroupDto,
      updatedAt: new Date(),
    });

    const updatedDoc = await docRef.get();

    return {
      id: updatedDoc.id,
      ...updatedDoc.data(),
    } as ModifierGroup;
  }

  async removeModifierGroup(id: string): Promise<void> {
    const docRef = this.firebaseService.modifierGroupsCollection.doc(id);
    await docRef.delete();
  }
}
