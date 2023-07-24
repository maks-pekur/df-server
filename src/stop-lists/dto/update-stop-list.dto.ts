import { PartialType } from '@nestjs/mapped-types';
import { CreateStopListDto } from './create-stop-list.dto';

export class UpdateStopListDto extends PartialType(CreateStopListDto) {}
