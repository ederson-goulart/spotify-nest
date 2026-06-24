import { IsString, IsOptional, IsEnum, Length, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateBandDto {
  @IsString({ message: 'O nome da banda é obrigatório.' })
  @Length(1, 100)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  name: string;

  @IsString({ message: 'O slug é obrigatório.' })
  @Matches(/^[a-z0-9-]+$/, { message: 'Slug deve conter apenas letras minúsculas, números e hifens.' })
  @Transform(({ value }) => (typeof value === 'string' ? value.toLowerCase().trim() : value))
  slug: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['active', 'inactive'], { message: 'Status inválido. Permitidos: active, inactive.' })
  @IsOptional()
  status?: 'active' | 'inactive' = 'active';
}
