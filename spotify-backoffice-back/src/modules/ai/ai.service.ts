import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private ai: GoogleGenAI | null = null;
  private hasKey: boolean = false;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (apiKey) {
      this.ai = new GoogleGenAI({ apiKey });
      this.hasKey = true;
    } else {
      this.logger.warn('GEMINI_API_KEY não configurada no arquivo .env. O módulo de IA operará em modo de simulação.');
    }
  }

  async generateBandBio(bandName: string, references: string[]): Promise<string> {
    if (!this.hasKey || !this.ai) {
      return `[Modo de Simulação] ${bandName} é uma consagrada banda nacional inspirada pelas sonoridades de ${references.join(', ')}. Conhecida por letras reflexivas, arranjos dinâmicos e shows envolventes que encantam os fãs do gênero.`;
    }

    try {
      const prompt = `Escreva uma biografia curta (máximo 120 palavras) e atraente para a banda "${bandName}". 
        Esta banda tem influência musical de: ${references.join(', ')}. 
        O tom do texto deve ser profissional e cativante para fãs de música. Retorne apenas o parágrafo da biografia, sem cabeçalhos ou observações adicionais.`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return response.text ? response.text.trim() : 'Biografia indisponível no momento.';
    } catch (error: any) {
      this.logger.error(`Erro no Gemini (generateBandBio): ${error.message}`);
      throw new InternalServerErrorException(`Falha ao gerar biografia por IA: ${error.message}`);
    }
  }

  async suggestTrackTags(title: string, bandBio: string): Promise<string[]> {
    if (!this.hasKey || !this.ai) {
      return ['indie', 'rock', 'nostalgico', 'melodico', 'alternativo'];
    }

    try {
      const prompt = `Com base no título da música "${title}" e na biografia da banda a seguir, sugira de 3 a 5 tags curtas (apenas 1 palavra cada) de humor, ritmo ou estilo (ex: "melancolico", "acustico", "agitado", "romantico", "relaxante") separadas apenas por vírgulas.
        Biografia da banda: ${bandBio}.
        Retorne apenas a lista de tags separada por vírgula, sem nenhuma outra frase ou introdução.`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const tagsText = response.text || '';
      return tagsText
        .split(',')
        .map((tag) => tag.trim().toLowerCase().replace(/[.\"]/g, ''))
        .filter((tag) => tag.length > 0);
    } catch (error: any) {
      this.logger.error(`Erro no Gemini (suggestTrackTags): ${error.message}`);
      return ['musica', 'novo'];
    }
  }

  async getErrorInsights(): Promise<string> {
    const recentErrors = await this.prisma.analyticsEvent.findMany({
      where: { type: 'ERROR' },
      take: 15,
      orderBy: { timestamp: 'desc' },
      select: {
        page: true,
        action: true,
        metadata: true,
        timestamp: true,
      },
    });

    if (recentErrors.length === 0) {
      return 'Nenhum evento de erro foi registrado recentemente na plataforma. O sistema está estável.';
    }

    const errorDetails = recentErrors.map((err, index) => {
      const meta = err.metadata ? JSON.stringify(err.metadata) : 'Sem detalhes';
      return `${index + 1}. [${err.timestamp.toISOString()}] Rota: ${err.page} | Ação: ${err.action} | Detalhes: ${meta}`;
    }).join('\n');

    if (!this.hasKey || !this.ai) {
      return `[Modo de Simulação] Relatório de Insights de Erros:
        - Identificamos ${recentErrors.length} erros no banco.
        - Análise: Erros recorrentes ocorrem na rota de uploads devido a chaves expiradas ou falta de espaço no MinIO.
        - Recomendação: Validar conexão com o S3/MinIO e ajustar limites de upload de arquivos no multer.`;
    }

    try {
      const prompt = `Analise a seguinte lista de logs de erro capturados no painel administrativo do nosso aplicativo clone do Spotify. 
        Identifique o padrão dos erros mais frequentes (ex: problemas no Minio S3, falhas de validação, erro de banco) 
        e forneça um resumo estruturado de até 3 parágrafos curtos explicando:
        1. Quais os erros mais recorrentes detectados na lista.
        2. A provável causa raiz técnica de cada um.
        3. A recomendação técnica clara para o time de desenvolvimento sobre como resolvê-los.
        
        Lista de Logs de Erros:\n${errorDetails}`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return response.text ? response.text.trim() : 'Resumo de insights indisponível no momento.';
    } catch (error: any) {
      this.logger.error(`Erro no Gemini (getErrorInsights): ${error.message}`);
      throw new InternalServerErrorException(`Falha ao gerar insights de erros: ${error.message}`);
    }
  }
}
