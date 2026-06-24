import { Controller, Post, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { SystemService } from './system.service';
import { MigrationSecretGuard } from '../../common/guards/migration-secret.guard';

@Controller('system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Post('migrate')
  @UseGuards(MigrationSecretGuard)
  async runMigrations() {
    try {
      const result = await this.systemService.executeMigrate();
      return {
        success: true,
        message: 'Migrations executadas com sucesso.',
        output: result,
      };
    } catch (error: any) {
      throw new HttpException(
        {
          success: false,
          error: 'Falha ao executar as migrations',
          details: error.message,
          stderr: error.stderr || '',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
