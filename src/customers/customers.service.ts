import { Injectable, Logger } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  private readonly logger: Logger;
  constructor() {
    this.logger = new Logger(CustomersService.name);
  }

  async addCustomer(createCustomerDto: CreateCustomerDto) {
    // try {
    //   const currentTime = new Date();
    //   const newCustomer = {
    //     ...createCustomerDto,
    //     createdAt: currentTime,
    //     updatedAt: currentTime,
    //   };
    //   const customerRef: DocumentReference =
    //     this.firebaseService.customersCollection.doc();
    //   await customerRef.set(newCustomer);
    //   const customerSnapshot: DocumentSnapshot<DocumentData> =
    //     await customerRef.get();
    //   const customer: Customer = {
    //     id: customerSnapshot.id,
    //     createdAt: customerSnapshot.createTime.toDate(),
    //     updatedAt: customerSnapshot.updateTime.toDate(),
    //     ...createCustomerDto,
    //   };
    //   return customer;
    // } catch (error) {
    //   throw new NotFoundException('Customers were not created');
    // }
  }

  async getCustomers() {
    // try {
    //   const querySnapshot =
    //     await this.firebaseService.customersCollection.get();
    //   const customers = querySnapshot.docs.map((doc) => ({
    //     id: doc.id,
    //     ...doc.data(),
    //   })) as Customer[];
    //   return customers;
    // } catch (error) {
    //   throw new NotFoundException('Customers not found');
    // }
  }

  // async getCustomerByStore(storeId: string): Promise<DocumentData | null> {
  //   try {
  //     const snapshot = await this.firebaseService.customersCollection
  //       .where('storeId', '==', uuid)
  //       .get();

  //     if (snapshot.empty) {
  //       return null;
  //     }

  //     return snapshot.docs[0].data();
  //   } catch (error) {
  //     throw new NotFoundException('Customer not found');
  //   }
  // }

  async updateCustomer(id: string, updateCustomerDto: UpdateCustomerDto) {
    // try {
    //   const customerRef = this.firebaseService.customersCollection.doc(id);
    //   const snapshot = await customerRef.get();
    //   if (!snapshot.exists) {
    //     throw new NotFoundException('Customer not found');
    //   }
    //   const updatedCustomer = {
    //     ...snapshot.data(),
    //     ...updateCustomerDto,
    //     updatedAt: new Date().toISOString(),
    //   };
    //   await customerRef.set(updatedCustomer);
    //   return updatedCustomer;
    // } catch (error) {
    //   throw new NotFoundException('Customer was not updated');
    // }
  }

  async removeCustomer(id: string) {
    //   try {
    //     const customerRef = this.firebaseService.customersCollection.doc(id);
    //     const snapshot = await customerRef.get();
    //     if (!snapshot.exists) {
    //       throw new NotFoundException('Customer not found');
    //     }
    //     await customerRef.delete();
    //   } catch (error) {
    //     throw new NotFoundException('Customer was not found');
    //   }
    // }
  }
}
