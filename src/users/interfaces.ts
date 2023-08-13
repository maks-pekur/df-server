export interface IUser {
  id: string;
  name: string;
  email: string;
  roles: string[];
  phoneNumber: string;
  isPhoneVerified: boolean;
  password: string;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserAddress {
  label: string;
  street: string;
  build: string;
  local: string;
  city: string;
  state: string;
  country: string;
}
