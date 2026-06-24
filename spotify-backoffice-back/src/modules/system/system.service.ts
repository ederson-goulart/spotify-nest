import { Injectable, Logger } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';

const execAsync = promisify(exec);

@Injectable()
export class SystemService {
  private readonly logger = new Logger(SystemService.name);

  async executeMigrate(): Promise<string> {
    this.logger.log('Iniciando a execução das migrations remota...');
    
    const workingDir = path.resolve(__dirname, '../../..');
    this.logger.log(`Diretório de trabalho para migração: ${workingDir}`);

    try {
      const { stdout, stderr } = await execAsync('npx prisma migrate deploy', {
        cwd: workingDir,
      });

      if (stderr && !stdout) {
        this.logger.warn(`Migração executada com avisos: ${stderr}`);
      } else {
        this.logger.log(`Resultado da migração: ${stdout}`);
      }

      return stdout || stderr || 'Nenhuma migração pendente ou saída vazia.';
    } catch (error: any) {
      this.logger.error(`Erro ao executar migration: ${error.message}`);
      throw error;
    }
  }
}
