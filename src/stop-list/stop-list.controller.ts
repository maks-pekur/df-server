import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { StopList } from './entities/stop-list.entity';
import { StopListService } from './stop-list.service';

@Controller('stop-list')
export class StopListController {
  constructor(private readonly stopListService: StopListService) {}

  @Post('/:restaurantId')
  async addToStopList(
    @Param('restaurantId') restaurantId: string,
    @Body('itemId') itemId: string,
  ): Promise<void> {
    return this.stopListService.addToStopList(restaurantId, itemId);
  }

  @Delete('/:restaurantId')
  async removeFromStopList(
    @Param('restaurantId') restaurantId: string,
    @Body('itemId') itemId: string,
  ): Promise<{ message: string }> {
    const message = await this.stopListService.removeFromStopList(
      restaurantId,
      itemId,
    );
    return { message };
  }

  @Get('/:restaurantId')
  async getStopList(
    @Param('restaurantId') restaurantId: string,
  ): Promise<StopList> {
    return this.stopListService.getStopList(restaurantId);
  }
}
