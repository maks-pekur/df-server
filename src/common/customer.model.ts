export class Customer {
  id?: string;
  name: string;
  phoneNumber: string;
  email: string;
  customerAddress: [
    {
      label: string;
      street: string;
      build: string;
      local: string;
      city: string;
      state: string;
      country: string;
    },
  ];
  createdAt: any;
  updatedAt: any;
}
