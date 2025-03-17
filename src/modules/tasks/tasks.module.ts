import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service';
import { KafkaService } from '../kafka/kafka.service';

@Module({
  imports: [],
  controllers: [TasksController],
  providers: [TasksService, PrismaService, KafkaService],
})
export class TasksModule {}
