import { IsString, IsInt, IsPositive, IsEnum, IsUUID, Length, Matches, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateTrackDto {
  @IsString({ message: 'O título deve ser uma string.' })
  @Length(1, 200)
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  title?: string;

  @IsString({ message: 'O slug deve ser uma string.' })
  @Matches(/^[a-z0-9-]+$/, { message: 'Slug deve conter apenas letras minúsculas, números e hifens.' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.toLowerCase().trim() : value))
  slug?: string;

  @IsInt({ message: 'Duração deve ser um número inteiro.' })
  @IsPositive({ message: 'Duração deve ser maior que zero.' })
  @IsOptional()
  durationInSeconds?: number;

  @IsUUID('4', { message: 'Selecione uma banda válida (ID inválido).' })
  @IsOptional()
  bandId?: string;

  @IsEnum(['active', 'inactive'], { message: 'Status inválido. Permitidos: active, inactive.' })
  @IsOptional()
  status?: 'active' | 'inactive';
}
