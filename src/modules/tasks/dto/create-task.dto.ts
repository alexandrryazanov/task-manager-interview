import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @MaxLength(255)
  @MinLength(1)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  @MinLength(1)
  description?: string;
}
