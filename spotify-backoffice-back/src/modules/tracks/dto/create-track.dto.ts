import { IsString, IsInt, IsPositive, IsEnum, IsUUID, Length, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTrackDto {
  @IsString({ message: 'O título da faixa é obrigatório.' })
  @Length(1, 200)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  title: string;

  @IsString({ message: 'O slug é obrigatório.' })
  @Matches(/^[a-z0-9-]+$/, { message: 'Slug deve conter apenas letras minúsculas, números e hifens.' })
  @Transform(({ value }) => (typeof value === 'string' ? value.toLowerCase().trim() : value))
  slug: string;

  @IsInt({ message: 'Duração deve ser um número inteiro.' })
  @IsPositive({ message: 'Duração deve ser maior que zero.' })
  durationInSeconds: number;

  @IsUUID('4', { message: 'Selecione uma banda válida (ID inválido).' })
  bandId: string;

  @IsEnum(['active', 'inactive'], { message: 'Status inválido. Permitidos: active, inactive.' })
  status?: 'active' | 'inactive' = 'active';
}
