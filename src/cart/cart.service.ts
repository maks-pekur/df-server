import { Injectable, NotFoundException } from '@nestjs/common';
import { DocumentData, DocumentSnapshot } from 'firebase-admin/firestore';
import { FirebaseService } from 'src/firebase/firebase.service';
import { paymentMethod } from 'src/orders/entities/order.entity';
import { ProductsService } from 'src/products/products.service';
import { PromoCodesService } from 'src/promo-codes/promo-codes.service';
import { orderType } from './../orders/entities/order.entity';
import { CartItemDto } from './dto/cart-item.dto';
import { Cart } from './entities/cart.entity';

@Injectable()
export class CartService {
  constructor(
    private productsService: ProductsService,
    private firebaseService: FirebaseService,
    private promoCodeService: PromoCodesService,
  ) {}

  async getCartByCustomerId(customerId: string): Promise<Cart | null> {
    try {
      const cartQuery = this.firebaseService.cartCollection.where(
        'customerId',
        '==',
        customerId,
      );
      const cartSnapshot = await cartQuery.get();

      if (!cartSnapshot.empty) {
        const cartDoc = cartSnapshot.docs[0];
        const cartData = cartDoc.data();
        return {
          id: cartDoc.id,
          docRef: cartDoc.ref,
          customerId: cartData.customerId,
          totalPrice: cartData.totalPrice,
          items: cartData.items || [],
          deliveryCost: cartData.deliveryCost || 0,
          coinCount: cartData.coinCount || 0,
          paymentMethodType: cartData.paymentMethodType,
          orderType: cartData.orderType,
          createdAt: cartData.createdAt,
          updatedAt: cartData.updatedAt,
        };
      } else {
        return null;
      }
    } catch (error) {
      throw new NotFoundException('Cart not found');
    }
  }

  async getCartById(cartId: string): Promise<DocumentData | null> {
    try {
      const cartDoc: DocumentSnapshot<DocumentData> =
        await this.firebaseService.cartCollection.doc(cartId).get();
      if (!cartDoc.exists) {
        throw new NotFoundException('Cart not found');
      }
      return { id: cartDoc.id, ...cartDoc.data() };
    } catch (error) {
      throw new NotFoundException('Cart not found');
    }
  }

  async getItemFromCart(
    customerId: string,
    productId: string,
  ): Promise<number> {
    try {
      const cart = await this.getCartByCustomerId(customerId);

      if (!cart) {
        throw new NotFoundException('Cart not found');
      }

      const existingItems = cart.items || [];

      const item = existingItems.find(
        (item: any) => item.productId === productId,
      );

      if (!item) {
        throw new NotFoundException('Item not found in cart');
      }

      return item.quantity;
    } catch (error) {
      throw new NotFoundException('Cart not found');
    }
  }

  async addItemToCart(body: CartItemDto): Promise<void> {
    try {
      const { productId, quantity, customerId } = body;
      const product = await this.productsService.getOneProduct(productId);
      const cart = await this.getCartByCustomerId(customerId);

      if (cart) {
        // Cart exists, update existing cart
        const existingItems = cart.items || [];
        let itemUpdated = false;

        const updatedItems = existingItems.map((item: any) => {
          if (item.productId === productId) {
            item.quantity += quantity;
            item.subTotalPrice = item.quantity * product.price;
            itemUpdated = true;
          }
          return item;
        });

        if (!itemUpdated) {
          const newItem = {
            name: product.name,
            price: product.price,
            productId,
            quantity,
            subTotalPrice: product.price * quantity,
          };
          updatedItems.push(newItem);
        }

        const updatedCart: Cart = {
          ...cart,
          items: updatedItems,
        };

        await this.recalculateCart(updatedCart); // Update cart and calculate totalPrice and deliveryCost
      } else {
        // Cart doesn't exist, create a new cart
        const newItem = {
          productId,
          name: product.name,

          price: product.price,
          quantity,
          subTotalPrice: product.price * quantity,
        };

        const currentTime = new Date();

        const newCartData: Omit<Cart, 'id' | 'docRef'> = {
          customerId,
          items: [newItem],
          totalPrice: 0,
          coinCount: 0,
          deliveryCost: 0,
          createdAt: currentTime,
          updatedAt: currentTime,
          paymentMethodType: paymentMethod.CARD,
          orderType: orderType.TAKE_AWAY,
        };

        const cartRef = await this.firebaseService.cartCollection.add(
          newCartData,
        );

        const updatedCart: Cart = {
          ...newCartData,
          id: cartRef.id,
          docRef: cartRef,
        };

        await this.recalculateCart(updatedCart);
      }
    } catch (error) {
      throw new NotFoundException('Cart not found');
    }
  }

  async removeItemFromCart(body: {
    customerId: string;
    productId: string;
  }): Promise<Cart> {
    const { customerId, productId } = body;
    const cart = await this.getCartByCustomerId(customerId);
    const product = await this.productsService.getOneProduct(productId);

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const updatedItems = cart.items
      .map((item: any) => {
        if (item.productId === productId) {
          item.quantity -= 1;
          item.subTotalPrice = item.quantity * product.price;
        }
        return item;
      })
      .filter((item: any) => item.quantity > 0);

    const updatedCart: Cart = {
      ...cart,
      items: updatedItems,
    };

    await this.recalculateCart(updatedCart);

    return updatedCart;
  }

  async updateCart(cartId: string, updates: any): Promise<void> {
    try {
      const cart = await this.getCartById(cartId);
      if (!cart) {
        throw new NotFoundException('Cart not found');
      }

      const updatedData = {
        ...updates,
        updatedAt: new Date(),
      };

      await this.firebaseService.cartCollection.doc(cartId).update(updatedData);
    } catch (error) {
      throw new NotFoundException('Cart not found');
    }
  }

  private async recalculateCart(cart: Cart): Promise<void> {
    const existingItems = cart.items || [];

    const totalItemsPrice = existingItems.reduce(
      (total: number, item: any) => total + item.subTotalPrice,
      0,
    );

    function calculateDeliveryCost(totalPrice: number): number {
      if (totalPrice <= 0) {
        return 0;
      } else if (totalPrice <= 299) {
        return 200;
      } else if (totalPrice >= 300 && totalPrice <= 699) {
        return 99;
      } else {
        return 1;
      }
    }

    const deliveryCost = calculateDeliveryCost(totalItemsPrice);
    const coinCount = Math.floor((totalItemsPrice * 5) / 100);
    const totalPrice = totalItemsPrice + deliveryCost;

    const cartRef = this.firebaseService.cartCollection.doc(cart.id);

    await cartRef.update({
      items: existingItems,
      coinCount,
      totalPrice,
      deliveryCost,
      updatedAt: new Date(),
    });
  }

  async deleteCart(customerId: string): Promise<void> {
    try {
      const cart = await this.getCartByCustomerId(customerId);

      if (!cart) {
        throw new NotFoundException('Cart not found');
      }

      await cart.docRef.delete();
      return;
    } catch (error) {
      throw new NotFoundException('Cart not found');
    }
  }

  async applyPromoCodeToCart(customerId: string, promoCode: string) {
    const cart = await this.getCartByCustomerId(customerId);

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    const promoCodeDetails = await this.promoCodeService.getPromoCodeDetails(
      promoCode,
    );
    if (!promoCodeDetails) {
      throw new NotFoundException('Promo code not found');
    }
    // const discount = calculateDiscount(cart, promoCodeDetails);

    // const updatedItems = cart.items.map((item) => {
    //   const discountedPrice = applyDiscount(item.price, discount);
    //   const subTotalPrice = calculateSubTotalPrice(
    //     item.quantity,
    //     discountedPrice,
    //   );
    //   return { ...item, price: discountedPrice, subTotalPrice };
    // });

    // const updatedCart: Cart = {
    //   ...cart,
    //   items: updatedItems,
    // };

    // await this.updateCart(updatedCart);

    // return cart;
  }
}
