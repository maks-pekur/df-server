import { Injectable } from '@nestjs/common';
import { CreatePromoCodeDto } from './dto/create-promo-code.dto';
import { UpdatePromoCodeDto } from './dto/update-promo-code.dto';

@Injectable()
export class PromoCodesService {
  create(createPromoCodeDto: CreatePromoCodeDto) {
    return 'This action adds a new promoCode';
  }

  findAll() {
    return `This action returns all promoCodes`;
  }

  getPromoCodeDetails(id: string) {
    return `This action returns a #${id} promoCode`;
  }

  update(id: string, updatePromoCodeDto: UpdatePromoCodeDto) {
    return `This action updates a #${id} promoCode`;
  }

  remove(id: string) {
    return `This action removes a #${id} promoCode`;
  }
}
