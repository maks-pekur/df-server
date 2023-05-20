import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Post('/')
  async addProduct(@Body() createProductDto: CreateProductDto) {
    const product = await this.productService.addProduct(createProductDto);
    return product;
  }

  @Get('/')
  async getProducts(@Query('category') category: string) {
    if (category) {
      const filteredProducts = await this.productService.getProductsByCategory(
        category,
      );
      return filteredProducts;
    } else {
      const allProducts = await this.productService.getAllProducts();
      return allProducts;
    }
  }

  @Get('/:id')
  async getProduct(@Param('id') id: string) {
    const product = await this.productService.getOneProduct(id);
    if (!product) throw new NotFoundException('Product does not exist!');
    return product;
  }

  @Put('/:id')
  async updateProduct(
    @Param('id') id: string,
    @Body() createProductDTO: CreateProductDto,
  ) {
    const product = await this.productService.updateProduct(
      id,
      createProductDTO,
    );
    if (!product) throw new NotFoundException('Product does not exist!');
    return product;
  }

  @Delete('/:id')
  async deleteProduct(@Param('id') id: string) {
    const product = await this.productService.deleteProduct(id);
    if (!product) throw new NotFoundException('Product does not exist');
    return product;
  }
}
