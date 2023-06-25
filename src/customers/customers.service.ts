import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
} from 'firebase-admin/firestore';
import { Customer } from 'src/customers/customer.model';
import { FirebaseService } from 'src/firebase/firebase.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  private readonly logger: Logger;
  constructor(private firebaseService: FirebaseService) {
    this.logger = new Logger(CustomersService.name);
  }

  async addCustomer(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    try {
      const currentTime = new Date();

      const newCustomer = {
        ...createCustomerDto,
        createdAt: currentTime,
        updatedAt: currentTime,
      };

      const customerRef: DocumentReference =
        this.firebaseService.customersCollection.doc();
      await customerRef.set(newCustomer);

      const customerSnapshot: DocumentSnapshot<DocumentData> =
        await customerRef.get();

      const customer: Customer = {
        id: customerSnapshot.id,
        createdAt: customerSnapshot.createTime.toDate(),
        updatedAt: customerSnapshot.updateTime.toDate(),
        ...createCustomerDto,
      };

      return customer;
    } catch (error) {
      throw new NotFoundException('Customers were not created');
    }
  }

  async getCustomers(): Promise<DocumentData[]> {
    try {
      const snapshot = await this.firebaseService.customersCollection.get();
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw new Error('Error getting customers');
    }
  }

  async getCustomer(id: string): Promise<DocumentData | null> {
    try {
      const snapshot = await this.firebaseService.customersCollection
        .doc(id)
        .get();
      if (!snapshot.exists) {
        return null;
      }
      return snapshot.data();
    } catch (error) {
      throw new NotFoundException('Customer not found');
    }
  }

  async updateCustomer(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<DocumentData> {
    try {
      const customerRef = this.firebaseService.customersCollection.doc(id);
      const snapshot = await customerRef.get();

      if (!snapshot.exists) {
        throw new NotFoundException('Customer not found');
      }

      const updatedCustomer = {
        ...snapshot.data(),
        ...updateCustomerDto,
        updatedAt: new Date().toISOString(),
      };

      await customerRef.set(updatedCustomer);

      return updatedCustomer;
    } catch (error) {
      throw new NotFoundException('Customer was not updated');
    }
  }

  async removeCustomer(id: string): Promise<void> {
    try {
      const customerRef = this.firebaseService.customersCollection.doc(id);
      const snapshot = await customerRef.get();

      if (!snapshot.exists) {
        throw new NotFoundException('Customer not found');
      }

      await customerRef.delete();
    } catch (error) {
      throw new NotFoundException('Customer was not found');
    }
  }
}
