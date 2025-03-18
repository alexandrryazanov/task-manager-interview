import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service';
import { KafkaService } from '../kafka/kafka.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  controllers: [TasksController],
  providers: [
    TasksService,
    PrismaService,
    KafkaService,
    JwtService,
    ConfigService,
  ],
})
export class TasksModule {}
