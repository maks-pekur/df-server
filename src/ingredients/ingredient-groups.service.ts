import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DocumentData, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { FirebaseService } from 'src/firebase/firebase.service';
import { CreateIngredientGroupDto } from './dto/create-ingredient-group.dto';
import { UpdateIngredientGroupDto } from './dto/update-ingredient-group.dto';
import { IngredientGroup } from './entities/ingredient.entity';

@Injectable()
export class IngredientGroupsService {
  private readonly logger: Logger;
  constructor(private firebaseService: FirebaseService) {
    this.logger = new Logger(IngredientGroupsService.name);
  }

  async createIngredientGroup(
    createIngredientGroupDto: CreateIngredientGroupDto,
  ): Promise<IngredientGroup> {
    const currentTime = new Date();
    const ingredientGroupData = {
      createdAt: currentTime,
      updatedAt: currentTime,
      ...createIngredientGroupDto,
    };

    const ingredientGroupRef =
      this.firebaseService.ingredientGroupsCollection.doc();
    await ingredientGroupRef.set(ingredientGroupData);

    const ingredientGroup = await ingredientGroupRef.get();

    return {
      id: ingredientGroup.id,
      ...ingredientGroup.data(),
    } as IngredientGroup;
  }

  async addIngredientToGroup(
    groupId: string,
    ingredientId: string,
  ): Promise<IngredientGroup> {
    const ingredientRef =
      this.firebaseService.ingredientsCollection.doc(ingredientId);
    const ingredientSnapshot = await ingredientRef.get();

    if (!ingredientSnapshot.exists) {
      throw new NotFoundException(
        `Ingredient with id ${ingredientId} not found`,
      );
    }

    const groupRef =
      this.firebaseService.ingredientGroupsCollection.doc(groupId);
    const groupSnapshot = await groupRef.get();

    if (!groupSnapshot.exists) {
      throw new NotFoundException('Ingredient Group not found');
    }

    const group = groupSnapshot.data() as IngredientGroup;
    group.id = groupSnapshot.id;

    // Check if the ingredient is already in the group
    if (group.ingredientsIds?.includes(ingredientId)) {
      throw new BadRequestException('Ingredient already in the group');
    }

    // Add the ingredient to the group
    if (group.ingredientsIds) {
      group.ingredientsIds.push(ingredientId);
    } else {
      group.ingredientsIds = [ingredientId];
    }

    await groupRef.update({ ingredientsIds: group.ingredientsIds });

    return group;
  }

  async removeIngredientFromGroup(
    groupId: string,
    ingredientId: string,
  ): Promise<IngredientGroup> {
    const ingredientRef =
      this.firebaseService.ingredientsCollection.doc(ingredientId);
    const ingredientSnapshot = await ingredientRef.get();

    if (!ingredientSnapshot.exists) {
      throw new NotFoundException(
        `Ingredient with id ${ingredientId} not found`,
      );
    }

    const groupRef =
      this.firebaseService.ingredientGroupsCollection.doc(groupId);
    const groupSnapshot = await groupRef.get();

    if (!groupSnapshot.exists) {
      throw new NotFoundException('Ingredient Group not found');
    }

    const group = groupSnapshot.data() as IngredientGroup;
    group.id = groupSnapshot.id;

    // Check if the ingredient is not in the group
    if (!group.ingredientsIds?.includes(ingredientId)) {
      throw new BadRequestException('Ingredient is not in the group');
    }

    // Remove the ingredient from the group
    group.ingredientsIds = group.ingredientsIds.filter(
      (id) => id !== ingredientId,
    );

    await groupRef.update({ ingredientsIds: group.ingredientsIds });

    return group;
  }

  async getAllIngredientGroups(): Promise<IngredientGroup[]> {
    const snapshot =
      await this.firebaseService.ingredientGroupsCollection.get();
    const ingredientGroups: IngredientGroup[] = [];
    snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
      ingredientGroups.push({
        id: doc.id,
        ...doc.data(),
      } as IngredientGroup);
    });
    return ingredientGroups;
  }

  async getIngredientGroup(id: string): Promise<IngredientGroup> {
    const doc = await this.firebaseService.ingredientGroupsCollection
      .doc(id)
      .get();
    if (!doc.exists) {
      return null;
    }
    return {
      id: doc.id,
      ...doc.data(),
    } as IngredientGroup;
  }

  async updateIngredientGroup(
    id: string,
    updateIngredientGroupDto: UpdateIngredientGroupDto,
  ): Promise<IngredientGroup> {
    const updatedData = {
      ...updateIngredientGroupDto,
      updatedAt: new Date(),
    };

    const ingredientGroupRef =
      this.firebaseService.ingredientGroupsCollection.doc(id);
    await ingredientGroupRef.update(updatedData);

    const updatedDoc = await ingredientGroupRef.get();

    return {
      id: updatedDoc.id,
      ...updatedDoc.data(),
    } as IngredientGroup;
  }

  async removeIngredientGroup(id: string): Promise<void> {
    const ingredientGroupRef =
      this.firebaseService.ingredientGroupsCollection.doc(id);
    const ingredientGroupSnapshot = await ingredientGroupRef.get();

    if (!ingredientGroupSnapshot.exists) {
      throw new NotFoundException('Ingredient group not found');
    }

    await ingredientGroupRef.delete();
  }
}
