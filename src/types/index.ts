export interface ICustomerAddress {
  label: string;
  street: string;
  build: string;
  local: string;
  city: string;
  state: string;
  country: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: UserRole;
}

export enum OrderStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  PREPARING = 'preparing',
  READY = 'ready',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

export enum UserRole {
  ADMIN = 'admin',
  STAFF = 'staff',
  CUSTOMER = 'customer',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  SUCCEEDED = 'succeeded',
}

export enum PaymentMethod {
  CASH = 'cash',
  CART_ON_DELIVERY = 'card_on_delivery',
  CARD = 'card',
  BLIK = 'blik',
  APPLE_PAY = 'apple_pay',
  GOOGLE_PAY = 'google_pay',
}

export enum OrderType {
  DELIVERY = 'delivery',
  TAKE_AWAY = 'takeaway',
  INSIDE = 'inside',
}

export interface IOrderItem {
  name: string;
  quantity: number;
  price: number;
  subTotalPrice: number;
}

export interface ISchedule {
  startDay: number;
  endDay: number;
  closeTime: string;
  openTime: string;
}

export interface ILocation {
  coordinates: {
    _lon: number;
    _lat: number;
  };
  city: string;
  street: {
    fullStreetTypeName: string;
    shortStreetTypeName: string;
    name: string;
  };
  houseNumber: string;
}

export interface IContacts {
  phone: string;
}

export interface ICartItem {
  productId: string;
  quantity: number;
  subTotalPrice: number;
  totalDiscount: number;
  totalWithDiscount: number;
}
