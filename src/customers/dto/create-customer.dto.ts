export class CreateCustomerDto {
  name: string;
  email: string;
  phoneNumber: string;
  customerAddress: {
    street: string;
    build: string;
    local: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  };
  createdAt: any;
  updatedAt: any;
}
