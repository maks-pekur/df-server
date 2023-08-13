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
import { IEnhancedRequest } from 'src/common/interfaces';
import { RolesGuard } from 'src/roles/guards/roles.guard';
import { Role } from 'src/roles/interfaces';
import { SubscriptionPeriod } from 'src/subscriptions/interfaces';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post('/add')
  create(@Body() dto: CreateCompanyDto) {
    return this.companiesService.createCompany(dto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERADMIN)
  async findAll() {
    const companies = await this.companiesService.findAll();
    return companies;
  }

  @Get('/:slug')
  async findOne(@Param('slug') slug: string) {
    const company = await this.companiesService.findOneBySlug(slug);
    return company;
  }

  @Post('/subscriptions/update')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERADMIN, Role.ADMIN)
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
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERADMIN)
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
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERADMIN)
  removeCompany(@Param('companyId') companyId: string) {
    return this.companiesService.removeCompany(companyId);
  }
}
