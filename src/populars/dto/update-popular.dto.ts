import { PartialType } from '@nestjs/mapped-types';
import { CreatePopularDto } from './create-popular.dto';

export class UpdatePopularDto extends PartialType(CreatePopularDto) {}
