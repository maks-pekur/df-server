export class CustomerAddress {
  label: string;
  street: string;
  build: string;
  local: string;
  city: string;
  state: string;
  country: string;
}

export class Customer {
  id?: string;
  name: string;
  phoneNumber: string;
  email: string;
  customerAddress: CustomerAddress;
  createdAt: Date;
  updatedAt: Date;
}
