import { Controller, Get, Post, Body, BadRequestException } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('enrich-bio')
  async enrichBio(@Body() body: { name: string; references?: string[] }) {
    if (!body.name) {
      throw new BadRequestException('O nome da banda é obrigatório para gerar a biografia.');
    }
    const references = body.references || [];
    const bio = await this.aiService.generateBandBio(body.name, references);
    return { bio };
  }

  @Post('suggest-tags')
  async suggestTags(@Body() body: { title: string; bandBio: string }) {
    if (!body.title || !body.bandBio) {
      throw new BadRequestException('O título da música e a biografia da banda são obrigatórios.');
    }
    const tags = await this.aiService.suggestTrackTags(body.title, body.bandBio);
    return { tags };
  }

  @Get('error-insights')
  async getErrorInsights() {
    const insights = await this.aiService.getErrorInsights();
    return { insights };
  }
}
