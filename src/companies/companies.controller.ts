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
import { CompanySubscription } from './entities/company-subscription.entity';

@Controller('companies')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('superadmin')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  createCompany(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.createCompany(createCompanyDto);
  }

  @Get()
  findAll() {
    return this.companiesService.findAll();
  }

  @Get(':id/subscription')
  async getSubscription(@Param('id') id: string): Promise<CompanySubscription> {
    return await this.companiesService.getCompanySubscription(id);
  }

  @Post(':id/subscription')
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
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Patch(':id')
  updateCompany(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companiesService.updateCompany(id, updateCompanyDto);
  }

  @Delete(':id')
  removeCompany(@Param('id') id: string) {
    return this.companiesService.removeCompany(id);
  }
}
