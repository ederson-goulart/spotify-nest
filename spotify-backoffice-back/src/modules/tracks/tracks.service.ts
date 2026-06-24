import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Injectable()
export class TracksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(page: number = 1, take: number = 10) {
    const skip = (page - 1) * take;
    const totalItems = await this.prisma.track.count();

    const tracks = await this.prisma.track.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: {
        band: {
          select: {
            name: true,
          },
        },
      },
    });

    const totalPages = Math.ceil(totalItems / take);
    return {
      pagination: { currentPage: page, totalItems, totalPages },
      tracks,
    };
  }

  async findOne(id: string) {
    const track = await this.prisma.track.findUnique({
      where: { id },
      include: {
        band: {
          select: {
            name: true,
          },
        },
      },
    });
    if (!track) {
      throw new NotFoundException('Música não encontrada.');
    }
    return track;
  }

  async create(dto: CreateTrackDto) {
    const trackExists = await this.prisma.track.findFirst({
      where: { slug: dto.slug },
    });
    if (trackExists) {
      throw new ConflictException('Música com este slug já cadastrada.');
    }

    const bandExists = await this.prisma.band.findUnique({
      where: { id: dto.bandId },
    });
    if (!bandExists) {
      throw new NotFoundException('Banda selecionada não existe.');
    }

    const track = await this.prisma.track.create({
      data: {
        title: dto.title,
        slug: dto.slug,
        durationInSeconds: dto.durationInSeconds,
        bandId: dto.bandId,
      },
      include: {
        band: {
          select: {
            name: true,
          },
        },
      },
    });

    await this.prisma.analyticsEvent.create({
      data: {
        type: 'CREATE_TRACK',
        page: '/admin/tracks',
        action: 'create',
        metadata: { trackId: track.id, trackTitle: track.title },
      },
    });

    return track;
  }

  async update(id: string, dto: UpdateTrackDto) {
    const existing = await this.prisma.track.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('Música não encontrada.');
    }

    if (dto.bandId) {
      const bandExists = await this.prisma.band.findUnique({
        where: { id: dto.bandId },
      });
      if (!bandExists) {
        throw new NotFoundException('Banda selecionada não existe.');
      }
    }

    const updated = await this.prisma.track.update({
      where: { id },
      data: {
        title: dto.title,
        slug: dto.slug,
        durationInSeconds: dto.durationInSeconds,
        bandId: dto.bandId,
      },
      include: {
        band: {
          select: {
            name: true,
          },
        },
      },
    });

    await this.prisma.analyticsEvent.create({
      data: {
        type: 'UPDATE_TRACK',
        page: '/admin/tracks',
        action: 'update',
        metadata: { trackId: updated.id, trackTitle: updated.title },
      },
    });

    return updated;
  }

  async remove(id: string) {
    const existing = await this.prisma.track.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('Música não encontrada.');
    }

    const deleted = await this.prisma.track.delete({
      where: { id },
    });

    await this.prisma.analyticsEvent.create({
      data: {
        type: 'DELETE_TRACK',
        page: '/admin/tracks',
        action: 'delete',
        metadata: { trackId: deleted.id, trackTitle: deleted.title },
      },
    });

    return deleted;
  }
}
