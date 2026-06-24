import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';

interface AnalyticsMetadata {
  ip?: string;
  country?: string;
  city?: string;
  region?: string;
  isp?: string;
  userAgent?: string;
  [key: string]: any;
}

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private readonly prisma: PrismaService) {}

  private async getGeolocation(ip: string) {
    if (ip === 'unknown' || ip === '127.0.0.1' || ip === '::1' || ip.startsWith('172.')) {
      return null;
    }
    try {
      const response = await fetch(
        `http://ip-api.com/json/${ip}?fields=status,country,city,regionName,lat,lon,timezone,isp,org,as`,
      );
      const data = await response.json();
      if (data.status === 'success') {
        return {
          country: data.country,
          city: data.city,
          region: data.regionName,
          lat: data.lat,
          lon: data.lon,
          timezone: data.timezone,
          isp: data.isp,
          org: data.org,
          as: data.as,
        };
      }
    } catch (error: any) {
      this.logger.error(`Erro ao obter geolocalização do IP ${ip}: ${error.message}`);
    }
    return null;
  }

  async trackEvent(dto: CreateEventDto, ipAddress: string, userAgent: string) {
    const geoData = await this.getGeolocation(ipAddress);
    
    const enhancedMetadata = {
      ...dto.metadata,
      ip: ipAddress,
      userAgent,
      ...geoData,
    };

    const enumType = dto.type as any;

    return this.prisma.analyticsEvent.create({
      data: {
        type: enumType,
        page: dto.page,
        action: dto.action || null,
        metadata: enhancedMetadata,
      },
    });
  }

  async getStats(period: string = '7d', page: number = 1, limit: number = 20) {
    let startDate = new Date();
    if (period === '24h') {
      startDate.setHours(startDate.getHours() - 24);
    } else if (period === '7d') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === '30d') {
      startDate.setDate(startDate.getDate() - 30);
    } else {
      startDate = new Date(0);
    }

    const totalPageViews = await this.prisma.analyticsEvent.count({
      where: {
        type: 'PAGE_VIEW',
        timestamp: { gte: startDate },
      },
    });

    const crudEvents = await this.prisma.analyticsEvent.groupBy({
      by: ['type'],
      where: {
        type: {
          in: [
            'CREATE_BAND',
            'UPDATE_BAND',
            'DELETE_BAND',
            'CREATE_TRACK',
            'UPDATE_TRACK',
            'DELETE_TRACK',
          ] as any,
        },
        timestamp: { gte: startDate },
      },
      _count: true,
    });

    const topPages = await this.prisma.analyticsEvent.groupBy({
      by: ['page'],
      where: {
        type: 'PAGE_VIEW',
        timestamp: { gte: startDate },
      },
      _count: true,
      orderBy: {
        _count: {
          page: 'desc',
        },
      },
      take: 5,
    });

    const last24h = new Date();
    last24h.setHours(last24h.getHours() - 24);

    const hourlyDistribution = await this.prisma.analyticsEvent.findMany({
      where: {
        type: 'PAGE_VIEW',
        timestamp: { gte: last24h },
      },
      select: {
        timestamp: true,
      },
    });

    const hourlyData = Array.from({ length: 24 }, (_, i) => {
      const hour = new Date();
      hour.setHours(hour.getHours() - (23 - i), 0, 0, 0);
      const hourStart = new Date(hour);
      const hourEnd = new Date(hour);
      hourEnd.setHours(hourEnd.getHours() + 1);

      const count = hourlyDistribution.filter(
        (event) => event.timestamp >= hourStart && event.timestamp < hourEnd,
      ).length;

      return {
        hour: hour.getHours(),
        count,
      };
    });

    const recentEvents = await this.prisma.analyticsEvent.findMany({
      orderBy: {
        timestamp: 'desc',
      },
      take: limit,
      skip: (page - 1) * limit,
      select: {
        id: true,
        type: true,
        page: true,
        action: true,
        timestamp: true,
        metadata: true,
      },
    });

    const totalRecentEvents = await this.prisma.analyticsEvent.count();

    const totalEvents = await this.prisma.analyticsEvent.count({
      where: {
        timestamp: { gte: startDate },
      },
    });

    const errorCount = await this.prisma.analyticsEvent.count({
      where: {
        type: 'ERROR',
        timestamp: { gte: startDate },
      },
    });

    const errorRate = totalEvents > 0 ? ((errorCount / totalEvents) * 100).toFixed(2) : '0';

    const bandCount = await this.prisma.band.count();
    const trackCount = await this.prisma.track.count();

    return {
      period,
      startDate,
      totalPageViews,
      crudOperations: crudEvents.reduce(
        (acc, item) => {
          acc[item.type] = item._count;
          return acc;
        },
        {} as Record<string, number>,
      ),
      topPages: topPages.map((item) => ({
        page: item.page,
        count: item._count,
      })),
      hourlyDistribution: hourlyData,
      recentEvents: recentEvents.map((event) => {
        const metadata = event.metadata as AnalyticsMetadata;
        return {
          id: event.id,
          type: event.type,
          page: event.page,
          action: event.action,
          timestamp: event.timestamp,
          ip: metadata?.ip || null,
          country: metadata?.country || null,
          city: metadata?.city || null,
          region: metadata?.region || null,
          isp: metadata?.isp || null,
        };
      }),
      recentEventsPagination: {
        page,
        limit,
        total: totalRecentEvents,
        totalPages: Math.ceil(totalRecentEvents / limit),
      },
      errorStats: {
        total: errorCount,
        rate: parseFloat(errorRate),
      },
      businessMetrics: {
        totalBands: bandCount,
        totalTracks: trackCount,
      },
    };
  }
}
