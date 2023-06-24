import { DocumentReference } from 'firebase-admin/firestore';

export class CreateModifierGroupDto {
  id?: string;
  name: string;
  modifiersIds?: DocumentReference[];
  createdAt: Date;
  updatedAt: Date;
}
