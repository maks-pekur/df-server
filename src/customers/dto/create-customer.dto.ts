import { CustomerAddress } from 'src/common/customer.model';

export class CreateCustomerDto {
  name: string;
  email: string;
  phoneNumber: string;
  customerAddress: CustomerAddress;
  createdAt: Date;
  updatedAt: Date;
}
