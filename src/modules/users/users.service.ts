import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    return this.prismaService.user.findMany();
  }

  async create(createUserDto: CreateUserDto) {
    return this.prismaService.user.create({
      data: {
        email: createUserDto.email,
      },
    });
  }
}
