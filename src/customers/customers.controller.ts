import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    const customer = await this.customersService.addCustomer(createCustomerDto);
    return customer;
  }

  @Get()
  async findAll() {
    const customers = await this.customersService.getCustomers();
    return customers;
  }

  // @Get('/:storeId')
  // async findByStore(@Param('storeId') storeId: string) {
  //   const customer = await this.customersService.getCustomerByStore(storeId);
  //   return customer;
  // }

  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    const customer = await this.customersService.updateCustomer(
      id,
      updateCustomerDto,
    );
    return customer;
  }

  @Delete('/:id')
  async remove(@Param('id') id: string) {
    return await this.customersService.removeCustomer(id);
  }
}
