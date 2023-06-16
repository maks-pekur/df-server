import { Injectable, NotFoundException } from '@nestjs/common';
import {
  DocumentData,
  DocumentSnapshot,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { Customer } from 'src/common/customer.model';
import { FirebaseService } from 'src/firebase/firebase.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private firebaseService: FirebaseService) {}

  async addCustomer(createCustomerDto: CreateCustomerDto) {
    try {
      const currentTime = serverTimestamp();
      const newCustomer = {
        ...createCustomerDto,
        createdAt: currentTime,
        updatedAt: currentTime,
      };
      await addDoc(this.firebaseService.customersCollection, newCustomer);
      return newCustomer;
    } catch (error) {
      throw new NotFoundException('Customers does not create');
    }
  }

  async getCustomers(): Promise<Customer[]> {
    try {
      const querySnapshot = await getDocs(
        this.firebaseService.customersCollection,
      );
      const customers: Customer[] = [];

      querySnapshot.forEach((doc) => {
        const customerData = doc.data() as Customer;
        customers.push(customerData);
      });

      return customers;
    } catch (error) {
      throw new Error('Error getting customers');
    }
  }

  async getCustomer(id: string): Promise<Customer | null> {
    try {
      const customerDoc = doc(this.firebaseService.customersCollection, id);
      const customerSnapshot: DocumentSnapshot<DocumentData> = await getDoc(
        customerDoc,
      );
      const customerData: Customer | undefined = customerSnapshot.data() as
        | Customer
        | undefined;
      return customerData ?? null;
    } catch (error) {
      throw new NotFoundException('Customer not found');
    }
  }

  async updateCustomer(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    try {
      const customerDoc = doc(this.firebaseService.customersCollection, id);
      const customerSnapshot = await getDoc(customerDoc);
      const customerData = customerSnapshot.data();

      Object.assign(customerData, updateCustomerDto);

      const currentTime = serverTimestamp();
      customerData.updatedAt = currentTime;

      await setDoc(customerDoc, customerData);
      return customerData as Customer;
    } catch (error) {
      throw new NotFoundException('Product does not update');
    }
  }

  async removeCustomer(id: string): Promise<void> {
    try {
      const customerDoc = doc(this.firebaseService.customersCollection, id);
      await deleteDoc(customerDoc);
    } catch (error) {
      throw new NotFoundException('Customer was not found');
    }
  }
}
