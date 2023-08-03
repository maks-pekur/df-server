import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Roles } from 'src/roles/decorators/roles.decorator';
import { SubscriptionPeriod } from 'src/types';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @Roles('superadmin')
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.createCompany(createCompanyDto);
  }

  @Get()
  findAll() {
    return this.companiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Post(':id/subscription')
  @Roles('superadmin', 'admin')
  async updateSubscription(
    @Param('id') id: string,
    @Body('newSubscriptionId') newSubscriptionId: string,
    @Body('isPaymentPromised') isPaymentPromised: boolean,
    @Body('period') period: SubscriptionPeriod,
  ) {
    return this.companiesService.updateSubscription(
      id,
      newSubscriptionId,
      isPaymentPromised,
      period,
    );
  }

  @Patch(':id')
  @Roles('superadmin')
  updateCompany(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companiesService.updateCompany(id, updateCompanyDto);
  }

  @Delete(':id')
  @Roles('superadmin')
  removeCompany(@Param('id') id: string) {
    return this.companiesService.removeCompany(id);
  }
}
