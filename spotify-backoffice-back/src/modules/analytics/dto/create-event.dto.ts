import { IsString, IsOptional, IsObject } from 'class-validator';

export class CreateEventDto {
  @IsString({ message: 'O tipo do evento é obrigatório.' })
  type: string;

  @IsString({ message: 'A página é obrigatória.' })
  page: string;

  @IsString()
  @IsOptional()
  action?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
