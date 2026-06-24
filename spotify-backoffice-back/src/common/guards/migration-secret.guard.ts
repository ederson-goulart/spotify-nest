import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MigrationSecretGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const clientSecret = request.headers['x-migration-secret'];
    const systemSecret = this.configService.get<string>('MIGRATION_SECRET') || process.env.MIGRATION_SECRET;

    if (!systemSecret) {
      throw new ForbiddenException('A chave MIGRATION_SECRET não está configurada no ambiente do servidor.');
    }

    if (clientSecret !== systemSecret) {
      throw new ForbiddenException('Chave secreta de migração inválida ou ausente.');
    }

    return true;
  }
}
