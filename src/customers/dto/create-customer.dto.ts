import { CustomerAddress } from 'src/customers/customer.model';

export class CreateCustomerDto {
  name: string;
  email: string;
  phoneNumber: string;
  customerAddress: CustomerAddress;
  createdAt: Date;
  updatedAt: Date;
}
