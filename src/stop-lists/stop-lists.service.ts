import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StopList } from './entities/stop-list.entity';

@Injectable()
export class StopListsService {
  constructor(
    @InjectRepository(StopList)
    private stopListRepository: Repository<StopList>,
  ) {}

  create(stopList: StopList) {
    return this.stopListRepository.save(stopList);
  }

  findAll() {
    return this.stopListRepository.find();
  }

  findOne(id: string) {
    return this.stopListRepository.findOne({ where: { id } });
  }

  update(id: string, stopList: StopList) {
    return this.stopListRepository.update(id, stopList);
  }

  remove(id: string) {
    return this.stopListRepository.delete(id);
  }
}
