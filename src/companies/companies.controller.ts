import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { SubscriptionPeriod } from 'src/types';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('companies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @Roles('superadmin')
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.createCompany(createCompanyDto);
  }

  @Get()
  @Roles('superadmin')
  findAll() {
    return this.companiesService.findAll();
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

  @Get(':id')
  @Roles('superadmin', 'admin', 'staff')
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
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
