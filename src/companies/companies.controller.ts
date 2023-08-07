import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { IEnhancedRequest } from 'src/common/interfaces/request.interface';
import { SubscriptionPeriod } from 'src/common/types';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post('/add')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('superadmin')
  create(@Body() dto: CreateCompanyDto) {
    return this.companiesService.createCompany(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async findAll() {
    const companies = await this.companiesService.findAll();
    return companies;
  }

  @Get('/:name')
  async findOne(@Param('name') name: string) {
    const company = await this.companiesService.findOne(name);
    return company;
  }

  @Post('/subscriptions/update')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin', 'admin')
  async updateSubscription(
    @Req() req: IEnhancedRequest,
    @Body('newSubscriptionId') newSubscriptionId: string,
    @Body('isPaymentPromised') isPaymentPromised: boolean,
    @Body('period') period: SubscriptionPeriod,
  ) {
    return this.companiesService.updateSubscription(
      req.user.companyId,
      newSubscriptionId,
      isPaymentPromised,
      period,
    );
  }

  @Patch('/update')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  updateCompany(
    @Req() req: IEnhancedRequest,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companiesService.updateCompany(
      req.user.companyId,
      updateCompanyDto,
    );
  }

  @Delete('/:companyId/delete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  removeCompany(@Param('companyId') companyId: string) {
    return this.companiesService.removeCompany(companyId);
  }
}
