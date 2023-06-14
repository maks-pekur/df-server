import {
  addDoc,
  deleteDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from '@firebase/firestore';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { ProductsService } from 'src/products/products.service';
import { PromoCodesService } from 'src/promo-codes/promo-codes.service';
import { CartItemDto } from './dto/cart-item.dto';
import { Cart } from './entities/cart.entity';

@Injectable()
export class CartService {
  constructor(
    private productsService: ProductsService,
    private firebaseService: FirebaseService,
    private promoCodeService: PromoCodesService,
  ) {}

  async getCartByUserId(userId: string): Promise<Cart | null> {
    try {
      const cartQuery = query(
        this.firebaseService.cartCollection,
        where('userId', '==', userId),
      );
      const cartSnapshot = await getDocs(cartQuery);

      if (!cartSnapshot.empty) {
        const cartDoc = cartSnapshot.docs[0];
        const cartData = cartDoc.data();
        return {
          id: cartDoc.id,
          docRef: cartDoc.ref,
          userId: cartData.userId,
          totalPrice: cartData.totalPrice,
          items: cartData.items || [],
          deliveryCost: cartData.deliveryCost || 0,
          coinCount: cartData.coinCount || 0,
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

  async getItemFromCart(userId: string, productId: string): Promise<number> {
    try {
      const cart = await this.getCartByUserId(userId);

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
      const { productId, quantity, userId } = body;
      const product = await this.productsService.getOneProduct(productId);
      const cart = await this.getCartByUserId(userId);

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

        await this._updateCart(updatedCart); // Update cart and calculate totalPrice and deliveryCost
      } else {
        // Cart doesn't exist, create a new cart
        const newItem = {
          productId,
          quantity,
          subTotalPrice: product.price * quantity,
        };

        const currentTime = serverTimestamp();
        const newCartData: Omit<Cart, 'id' | 'docRef'> = {
          userId,
          items: [newItem],
          totalPrice: 0,
          coinCount: 0,
          deliveryCost: 0,
          createdAt: currentTime,
          updatedAt: currentTime,
        };

        const docRef = await addDoc(
          this.firebaseService.cartCollection,
          newCartData,
        );
        const updatedCart: Cart = {
          ...newCartData,
          id: docRef.id,
          docRef,
        };

        await this._updateCart(updatedCart);
      }
    } catch (error) {
      throw new NotFoundException('Cart not found');
    }
  }

  async removeItemFromCart(body): Promise<Cart> {
    const { userId, productId } = body;
    const cart = await this.getCartByUserId(userId);
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

    await this._updateCart(updatedCart);

    return updatedCart;
  }

  private async _updateCart(cart: Cart): Promise<void> {
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

    await updateDoc(cart.docRef, {
      items: existingItems,
      coinCount,
      totalPrice,
      deliveryCost,
      updatedAt: serverTimestamp(),
    });
  }

  async deleteCart(userId: string): Promise<void> {
    try {
      const cart = await this.getCartByUserId(userId);

      if (!cart) {
        throw new NotFoundException('Cart not found');
      }

      await deleteDoc(cart.docRef);
      return;
    } catch (error) {
      throw new NotFoundException('Cart not found');
    }
  }

  async applyPromoCodeToCart(userId: string, promoCode: string) {
    const cart = await this.getCartByUserId(userId);

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

    // await this._updateCart(updatedCart);

    // return cart;
  }
}
