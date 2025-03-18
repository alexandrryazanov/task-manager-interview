import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import AuthGuard from '@/guards/auth.guard';
import { Permissions } from '@/types/permissions';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @UseGuards(AuthGuard(Permissions.TASK_READ))
  async getAll() {
    return this.tasksService.getAll();
  }

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }
}
