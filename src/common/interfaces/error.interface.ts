import { IOrderItem } from '../types';

export interface ResponseError extends Error {
  statusCode?: number;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  roles: string[];
  phoneNumber: string;
  isPhoneVerified: boolean;
  orders: IOrderItem[];
  reviews: string[];
  stores: string[];
  userCompanies: string[];
  refreshTokens: string;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}
