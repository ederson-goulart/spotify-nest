import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Query,
  Body,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { TracksService } from './tracks.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Controller('track')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('take') take: string = '10',
  ) {
    const pageNum = parseInt(page, 10) || 1;
    const takeNum = parseInt(take, 10) || 10;
    return this.tracksService.findAll(pageNum, takeNum);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.tracksService.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateTrackDto) {
    return this.tracksService.create(dto);
  }

  @Patch()
  async update(@Body() body: any) {
    const id = body.id;
    if (!id) {
      throw new BadRequestException('ID não informado.');
    }

    const updateDto = new UpdateTrackDto();
    if (body.title !== undefined) updateDto.title = body.title;
    if (body.slug !== undefined) updateDto.slug = body.slug;
    if (body.durationInSeconds !== undefined) {
      updateDto.durationInSeconds = parseInt(body.durationInSeconds, 10) || body.durationInSeconds;
    }
    if (body.bandId !== undefined) updateDto.bandId = body.bandId;
    if (body.status !== undefined) updateDto.status = body.status;

    return this.tracksService.update(id, updateDto);
  }

  @Delete()
  async remove(@Body('id') id: string) {
    if (!id) {
      throw new BadRequestException('ID não informado.');
    }
    return this.tracksService.remove(id);
  }
}
