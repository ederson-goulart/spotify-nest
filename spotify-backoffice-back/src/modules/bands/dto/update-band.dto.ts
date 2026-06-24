import { IsString, IsOptional, IsEnum, Length, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateBandDto {
  @IsString({ message: 'O nome da banda deve ser uma string.' })
  @Length(1, 100)
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  name?: string;

  @IsString({ message: 'O slug deve ser uma string.' })
  @Matches(/^[a-z0-9-]+$/, { message: 'Slug deve conter apenas letras minúsculas, números e hifens.' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.toLowerCase().trim() : value))
  slug?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['active', 'inactive'], { message: 'Status inválido. Permitidos: active, inactive.' })
  @IsOptional()
  status?: 'active' | 'inactive';
}
