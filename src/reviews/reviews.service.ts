import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrdersService } from 'src/orders/orders.service';
import { StoresService } from 'src/stores/stores.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly ordersService: OrdersService,
    private readonly usersService: UsersService,
    private readonly storesService: StoresService,
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const newReview = new Review();
    newReview.comment = createReviewDto.comment;
    newReview.tasteRating = createReviewDto.tasteRating;
    newReview.serviceRating = createReviewDto.serviceRating;

    if (createReviewDto.userId) {
      const user = await this.usersService.findOne(createReviewDto.userId);
      if (user) {
        newReview.user = user;
      }
    }

    if (createReviewDto.phoneNumber) {
      try {
        const user = await this.usersService.findByPhoneNumber(
          createReviewDto.phoneNumber,
        );
        if (user) {
          newReview.user = user;
        }
      } catch (error) {
        newReview.phoneNumber = createReviewDto.phoneNumber;
      }
    }

    if (createReviewDto.orderId) {
      const order = await this.ordersService.findOne(createReviewDto.orderId);
      if (order) {
        newReview.order = order;
      }
    }

    if (createReviewDto.storeId) {
      const store = await this.storesService.findOne(createReviewDto.storeId);
      if (store) {
        newReview.store = store;
      } else {
        throw new NotFoundException('Store not found');
      }
    }

    return this.reviewRepository.save(newReview);
  }

  async findAll(): Promise<Review[]> {
    return this.reviewRepository.find();
  }
}
