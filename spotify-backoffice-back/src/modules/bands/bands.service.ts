import { Injectable, NotFoundException, ConflictException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { CreateBandDto } from './dto/create-band.dto';
import { UpdateBandDto } from './dto/update-band.dto';

@Injectable()
export class BandsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  private async getDefaultUserId(): Promise<string> {
    let defaultUser = await this.prisma.user.findFirst();
    if (!defaultUser) {
      defaultUser = await this.prisma.user.create({
        data: {
          email: 'admin@spotify.com',
          password: 'default_password_for_system_creation',
        },
      });
    }
    return defaultUser.id;
  }

  async findAll(page: number = 1, take: number = 10) {
    const skip = (page - 1) * take;
    const totalItems = await this.prisma.band.count();

    const bands = await this.prisma.band.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });

    const totalPages = Math.ceil(totalItems / take);
    return {
      pagination: { currentPage: page, totalItems, totalPages },
      bands,
    };
  }

  async findOne(id: string) {
    const band = await this.prisma.band.findUnique({
      where: { id },
    });
    if (!band) {
      throw new NotFoundException('Banda não encontrada.');
    }
    return band;
  }

  async create(dto: CreateBandDto, file?: Express.Multer.File) {
    const bandExists = await this.prisma.band.findFirst({
      where: { name: dto.name },
    });
    if (bandExists) {
      throw new ConflictException('Banda já cadastrada.');
    }

    let coverUrl: string | null = null;
    if (file) {
      coverUrl = await this.storageService.uploadFile(file);
    }

    try {
      const userId = await this.getDefaultUserId();

      const band = await this.prisma.band.create({
        data: {
          name: dto.name,
          slug: dto.slug,
          description: dto.description || '',
          status: dto.status,
          coverUrl,
          userId,
        },
      });

      await this.prisma.analyticsEvent.create({
        data: {
          type: 'CREATE_BAND',
          page: '/admin/bands',
          action: 'create',
          metadata: { bandId: band.id, bandName: band.name },
          userId,
        },
      });

      return band;
    } catch (error: any) {
      if (error.code === 'P2011' || error.code === 'P2003' || error.code === 'P2002') {
        throw new BadRequestException('Não foi possível cadastrar a banda devido a um erro de validação ou restrição. Verifique os dados e tente novamente.');
      }
      throw new InternalServerErrorException('Ocorreu um erro interno ao cadastrar a banda. Tente novamente mais tarde.');
    }
  }

  async createBulk(dtoList: CreateBandDto[]) {
    const results = [];
    const userId = await this.getDefaultUserId();
    for (const dto of dtoList) {
      const bandExists = await this.prisma.band.findFirst({
        where: { name: dto.name },
      });
      if (!bandExists) {
        try {
          const band = await this.prisma.band.create({
            data: {
              name: dto.name,
              slug: dto.slug,
              description: dto.description || '',
              status: dto.status,
              userId,
            },
          });
          await this.prisma.analyticsEvent.create({
            data: {
              type: 'CREATE_BAND',
              page: '/admin/bands',
              action: 'create',
              metadata: { bandId: band.id, bandName: band.name },
              userId,
            },
          });
          results.push(band);
        } catch (error: any) {
          console.error(`Falha ao cadastrar a banda ${dto.name} no modo bulk:`, error.message);
        }
      }
    }
    return results;
  }

  async update(id: string, dto: UpdateBandDto, file?: Express.Multer.File) {
    const existing = await this.prisma.band.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException('Banda não encontrada.');
    }

    let coverUrl = existing.coverUrl;
    if (file) {
      coverUrl = await this.storageService.uploadFile(file);

      if (existing.coverUrl) {
        try {
          await this.storageService.deleteFile(existing.coverUrl);
        } catch (err) {
          console.error(`Falha ao remover arquivo antigo do cover: ${existing.coverUrl}`, err);
        }
      }
    }

    const updated = await this.prisma.band.update({
      where: { id },
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        status: dto.status,
        ...(file && { coverUrl }),
      },
    });

    const userId = await this.getDefaultUserId();
    await this.prisma.analyticsEvent.create({
      data: {
        type: 'UPDATE_BAND',
        page: '/admin/bands',
        action: 'update',
        metadata: { bandId: updated.id, bandName: updated.name },
        userId,
      },
    });

    return updated;
  }

  async remove(id: string) {
    const existing = await this.prisma.band.findUnique({
      where: { id },
      select: { id: true, coverUrl: true, name: true },
    });
    if (!existing) {
      throw new NotFoundException('Banda não encontrada.');
    }

    const deleted = await this.prisma.band.delete({
      where: { id },
    });

    if (existing.coverUrl) {
      try {
        await this.storageService.deleteFile(existing.coverUrl);
      } catch (err) {
        console.error(`Falha ao remover arquivo do cover deletado: ${existing.coverUrl}`, err);
      }
    }

    const userId = await this.getDefaultUserId();
    await this.prisma.analyticsEvent.create({
      data: {
        type: 'DELETE_BAND',
        page: '/admin/bands',
        action: 'delete',
        metadata: { bandId: deleted.id, bandName: deleted.name },
        userId,
      },
    });

    return deleted;
  }
}
