import { Controller, Get, Post, Body, Query, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AnalyticsService } from './analytics.service';
import { CreateEventDto } from './dto/create-event.dto';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post()
  async trackEvent(
    @Body() dto: CreateEventDto,
    @Req() req: Request,
  ) {
    const forwarded = req.headers['x-forwarded-for'] as string;
    const realIp = req.headers['x-real-ip'] as string;
    let ip = 'unknown';
    
    if (forwarded) {
      ip = forwarded.split(',')[0].trim();
    } else if (realIp) {
      ip = realIp;
    } else if (req.ip) {
      ip = req.ip;
    }

    if (ip === '::1' || ip === '::ffff:127.0.0.1') {
      ip = '127.0.0.1';
    }

    const userAgent = req.headers['user-agent'] || '';

    return this.analyticsService.trackEvent(dto, ip, userAgent);
  }

  @Get('stats')
  async getStats(
    @Query('period') period: string = '7d',
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '20',
  ) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    return this.analyticsService.getStats(period, pageNum, limitNum);
  }
}
