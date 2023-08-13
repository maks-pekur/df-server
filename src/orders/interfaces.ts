export interface IOrderItem {
  name: string;
  quantity: number;
  price: number;
  subTotalPrice: number;
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

export enum OrderType {
  DELIVERY = 'delivery',
  TAKE_AWAY = 'takeaway',
  INSIDE = 'inside',
}
