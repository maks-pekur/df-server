import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);

  constructor(
    @InjectRepository(Role) private rolesRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const existRole = await this.rolesRepository.findOne({
      where: { name: createRoleDto.name },
    });

    if (existRole) {
      throw new BadRequestException('Role already exists');
    }
    const newRole = {
      name: createRoleDto.name,
    };

    return await this.rolesRepository.save(newRole);
  }

  async findAll(): Promise<Role[]> {
    return await this.rolesRepository.find();
  }

  async findOne(id: string) {
    return `This action returns a #${id} role`;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  async remove(id: string) {
    const role = await this.rolesRepository.findOne({ where: { id } });

    if (!role) {
      throw new NotFoundException('Role was not removed');
    }

    await this.rolesRepository.delete(id);

    return { message: 'Role removed successfully' };
  }
}
