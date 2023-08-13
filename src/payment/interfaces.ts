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
