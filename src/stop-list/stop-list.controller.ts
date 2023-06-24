import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { StopListItemDto } from './dto/stop-list-item.dto';
import { StopListService } from './stop-list.service';

@Controller('stop-list')
export class StopListController {
  constructor(private readonly stopListService: StopListService) {}

  @Post()
  async addToStopList(@Body() stopListItemDto: StopListItemDto) {
    return this.stopListService.addToStopList(stopListItemDto);
  }

  @Delete()
  async removeFromStopList(@Body() stopListItemDto: StopListItemDto) {
    return this.stopListService.removeFromStopList(stopListItemDto);
  }

  @Get()
  async getStopList() {
    return this.stopListService.getStopList();
  }
}
