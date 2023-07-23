export interface CustomerAddress {
  label: string;
  street: string;
  build: string;
  local: string;
  city: string;
  state: string;
  country: string;
}

export enum orderStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  PREPARING = 'preparing',
  READY = 'ready',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  USER = 'user',
}

export enum paymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  SUCCEEDED = 'succeeded',
}

export enum paymentMethod {
  CASH = 'cash',
  CART_ON_DELIVERY = 'card_on_delivery',
  CARD = 'card',
  BLIK = 'blik',
  APPLE_PAY = 'apple_pay',
  GOOGLE_PAY = 'google_pay',
}

export enum orderType {
  DELIVERY = 'delivery',
  TAKE_AWAY = 'takeaway',
  INSIDE = 'inside',
}

export interface orderItem {
  name: string;
  quantity: number;
  price: number;
  subTotalPrice: number;
}

export interface Schedule {
  startDay: number;
  endDay: number;
  closeTime: string;
  openTime: string;
}

export interface Location {
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

export interface Contacts {
  phone: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  subTotalPrice: number;
  totalDiscount: number;
  totalWithDiscount: number;
}
