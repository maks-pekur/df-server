import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompaniesService } from 'src/companies/companies.service';
import { ImagesService } from 'src/images/images.service';
import { Repository } from 'typeorm';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { Ingredient } from './entities/ingredient.entity';

@Injectable()
export class IngredientsService {
  private readonly logger = new Logger(IngredientsService.name);

  constructor(
    @InjectRepository(Ingredient)
    private ingredientRepository: Repository<Ingredient>,
    private readonly imagesService: ImagesService,
    private readonly companiesService: CompaniesService,
  ) {}

  async create(
    companyId: string,
    dto: CreateIngredientDto,
    file: Express.Multer.File,
  ) {
    try {
      const company = await this.companiesService.findOneById(companyId);

      if (!company) {
        this.logger.warn('Company not found');
        throw new NotFoundException('Company not found');
      }

      const imageUrl = await this.imagesService.uploadImage(
        'ingredients',
        file,
      );

      const newIngredient = {
        ...dto,
        company: company,
        imageUrl: imageUrl,
      };

      const savedIngredient = await this.ingredientRepository.save(
        newIngredient,
      );

      return savedIngredient;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(storeId?: string) {
    try {
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: string, storeId?: string) {
    try {
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(
    id: string,
    file: Express.Multer.File,
    updateIngredientDto: UpdateIngredientDto,
  ) {
    try {
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: string): Promise<void> {
    try {
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
