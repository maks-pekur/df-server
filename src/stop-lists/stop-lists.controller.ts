import { Controller, Delete, Get, Param } from '@nestjs/common';
import { StopListsService } from './stop-lists.service';

@Controller('stop-lists')
export class StopListsController {
  constructor(private readonly stopListsService: StopListsService) {}

  // @Post()
  // create(@Body() createStopListDto: CreateStopListDto) {
  //   return this.stopListsService.create(createStopListDto);
  // }

  @Get()
  findAll() {
    return this.stopListsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stopListsService.findOne(id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateStopListDto: UpdateStopListDto,
  // ) {
  //   return this.stopListsService.update(id, updateStopListDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stopListsService.remove(id);
  }
}
