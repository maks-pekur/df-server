import { CustomerAddress } from 'src/types';

export class CreateCustomerDto {
  name: string;
  email: string;
  phoneNumber: string;
  customerAddress: CustomerAddress;
  createdAt: Date;
  updatedAt: Date;
}
