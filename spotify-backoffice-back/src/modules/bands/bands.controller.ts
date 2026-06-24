import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Query,
  Body,
  Param,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BandsService } from './bands.service';
import { CreateBandDto } from './dto/create-band.dto';
import { UpdateBandDto } from './dto/update-band.dto';

@Controller('band')
export class BandsController {
  constructor(private readonly bandsService: BandsService) {}

  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('take') take: string = '10',
  ) {
    const pageNum = parseInt(page, 10) || 1;
    const takeNum = parseInt(take, 10) || 10;
    return this.bandsService.findAll(pageNum, takeNum);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.bandsService.findOne(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('cover'))
  async create(
    @Body() dto: CreateBandDto,
    @UploadedFile() cover?: Express.Multer.File,
  ) {
    return this.bandsService.create(dto, cover);
  }

  @Post('bulk')
  async createBulk(@Body() dto: CreateBandDto[]) {
    if (!Array.isArray(dto)) {
      throw new BadRequestException('Dados encaminhados em um formato inválido.');
    }
    return this.bandsService.createBulk(dto);
  }

  @Patch()
  @UseInterceptors(FileInterceptor('cover'))
  async update(
    @Body() body: any,
    @UploadedFile() cover?: Express.Multer.File,
  ) {
    const id = body.id;
    if (!id) {
      throw new BadRequestException('ID não informado.');
    }

    const updateDto = new UpdateBandDto();
    if (body.name !== undefined) updateDto.name = body.name;
    if (body.slug !== undefined) updateDto.slug = body.slug;
    if (body.description !== undefined) updateDto.description = body.description;
    if (body.status !== undefined) updateDto.status = body.status;

    return this.bandsService.update(id, updateDto, cover);
  }

  @Delete()
  async remove(@Body('id') id: string) {
    if (!id) {
      throw new BadRequestException('ID não informado.');
    }
    return this.bandsService.remove(id);
  }
}
