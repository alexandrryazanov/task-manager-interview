import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { KafkaService } from '../kafka/kafka.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly kafkaService: KafkaService,
  ) {}

  async getAll() {
    return this.prismaService.task.findMany();
  }

  async create(createTaskDto: CreateTaskDto) {
    const task = await this.prismaService.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        ownerId: 1, // TODO: change it when we have auth
      },
    });

    await this.kafkaService.sendMessage('tasks', task);

    return task;
  }
}
