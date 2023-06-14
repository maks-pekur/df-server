import {
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from '@firebase/firestore';
import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';
import { ProductsService } from 'src/products/products.service';
import { CartItemDto } from './dto/cart-item.dto';
import { Cart } from './entities/cart.entity';

@Injectable()
export class CartService {
  constructor(
    private productsService: ProductsService,
    private firebaseService: FirebaseService,
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

  async addItemToCart(userId: string, body: CartItemDto): Promise<void> {
    try {
      const { productId, quantity } = body;
      const product = await this.productsService.getOneProduct(productId);
      const cart = await this.getCartByUserId(userId);

      if (cart) {
        const existingItems = cart.items || [];
        let itemUpdated = false;

        const updatedItems = existingItems.map((item: any) => {
          if (item.productId === productId) {
            item.quantity += Number(quantity);
            item.subTotalPrice = Number(item.quantity) * Number(product.price);
            itemUpdated = true;
          }
          return item;
        });

        if (!itemUpdated) {
          const newItem = {
            productId,
            quantity,
            subTotalPrice: Number(product.price) * Number(quantity),
          };
          updatedItems.push(newItem);
        }

        const totalPrice = updatedItems.reduce(
          (total: number, item: any) =>
            Number(total) + Number(item.subTotalPrice),
          0,
        );

        await updateDoc(cart.docRef, {
          items: updatedItems,
          totalPrice,
          updatedAt: serverTimestamp(),
        });
      } else {
        const newItem = {
          productId,
          quantity,
          subTotalPrice: Number(product.price) * Number(quantity),
        };

        const currentTime = serverTimestamp();
        const newCartData = {
          userId,
          items: [newItem],
          totalPrice: newItem.subTotalPrice,
          createdAt: currentTime,
          updatedAt: currentTime,
        };

        await setDoc(
          doc(this.firebaseService.cartCollection, userId),
          newCartData,
        );
      }
    } catch (error) {
      throw new NotFoundException('Cart not found');
    }
  }

  async removeItemFromCart(userId: string, productId: string) {
    try {
      const cart = await this.getCartByUserId(userId);

      if (!cart) {
        throw new NotFoundException('Cart not found');
      }

      const existingItems = cart.items || [];
      let totalPrice = 0;

      const updatedItems = existingItems
        .map((item: any) => {
          if (item.productId === productId) {
            if (item.quantity > 1) {
              item.quantity -= 1;
              item.subTotalPrice =
                (item.quantity * item.subTotalPrice) / (item.quantity + 1);
            } else {
              // Skip the item if quantity is 1 (delete it from the cart)
              return null;
            }
          }
          totalPrice += item.subTotalPrice;
          return item;
        })
        .filter(Boolean);

      await updateDoc(cart.docRef, {
        items: updatedItems,
        totalPrice: totalPrice,
        updatedAt: serverTimestamp(),
      });

      return;
    } catch (error) {
      throw new NotFoundException('Cart not found');
    }
  }

  async deleteCart(userId: string) {
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
}
