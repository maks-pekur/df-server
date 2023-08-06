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
import { Request } from 'express';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { IUser } from 'src/common/interfaces/error.interface';
import { SubscriptionPeriod } from 'src/common/types';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post('/add')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  create(@Body() dto: CreateCompanyDto) {
    return this.companiesService.createCompany(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
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
    @Req() req: Request,
    @Body('newSubscriptionId') newSubscriptionId: string,
    @Body('isPaymentPromised') isPaymentPromised: boolean,
    @Body('period') period: SubscriptionPeriod,
  ) {
    const user = req.user as IUser;

    return this.companiesService.updateSubscription(
      user.companyId,
      newSubscriptionId,
      isPaymentPromised,
      period,
    );
  }

  @Patch('/update')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('superadmin')
  updateCompany(
    @Req() req: Request,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    const user = req.user as IUser;

    return this.companiesService.updateCompany(
      user.companyId,
      updateCompanyDto,
    );
  }

  @Delete('/delete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  removeCompany(@Req() req: Request) {
    const user = req.user as IUser;
    return this.companiesService.removeCompany(user.companyId);
  }
}
