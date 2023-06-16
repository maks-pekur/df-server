export enum orderStatus {
  pending = 'pending',
  accepted = 'accepted',
  preparing = 'preparing',
  ready = 'ready',
  delivered = 'delivered',
  completed = 'completed',
}

export enum orderType {
  delivery = 'delivery',
  takeaway = 'takeaway',
  inside = 'inside',
}

export class OrderedItems {
  name: string;
  quantity: number;
  price: number;
  subTotalPrice: number;
}

export class Order {
  orderNumber: string;
  orderType: orderType;
  customerId: string;
  customerName: string;
  customerPhoneNumber: string;
  customerAddress: {
    street: string;
    build: number;
    local: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  };
  orderedItems: OrderedItems[];
  orderStatus: orderStatus;
  createdAt: any;
  updatedAt: any;
}
