import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersModule } from '../users/users.module';
import { TasksModule } from '../tasks/tasks.module';
import { KafkaModule } from '../kafka/kafka.module';

@Module({
  imports: [UsersModule, TasksModule, KafkaModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
