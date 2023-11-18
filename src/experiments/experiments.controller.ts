import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateExperimentDto } from './dto/create-experiment.dto';
import { CreateViewDto } from './dto/create-view.dto';
import { UpdateNodesDto } from './dto/update-nodes.dto';
import { UpdateViewDto } from './dto/update-view.dto';
import { ExperimentsService } from './experiments.service';

@Controller('experiments')
@ApiTags('experiments')
export class ExperimentsController {
  constructor(private readonly experimentsService: ExperimentsService) {}

  // trae todos los experimentos en la plataforma
  @Get()
  findAll() {
    return this.experimentsService.findAll();
  }

  // trae un experimento en particular
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.experimentsService.findOne(+id);
  }

  // crea un nuevo experimento
  @Post()
  create(@Body() createExperimentDto: CreateExperimentDto) {
    return this.experimentsService.create(createExperimentDto);
  }

  // crea una nueva vista
  @Post(':id/views')
  createView(@Param('id') id: string, @Body() createViewDto: CreateViewDto) {
    return this.experimentsService.createView(id, createViewDto);
  }

  // actualiza una vista en particular por cambios en widgets
  @Put(':id/views/:viewSlug')
  update(
    @Param('id') id: string,
    @Param('viewSlug') viewSlug: string,
    @Body() updateViewDto: UpdateViewDto,
  ) {
    return this.experimentsService.updateView(id, viewSlug, updateViewDto);
  }

  // actualiza los nodos de un experimento en particular
  @Patch(':id/nodes')
  updateNodes(@Param('id') id: string, @Body() updateNodesDto: UpdateNodesDto) {
    return this.experimentsService.updateNodes(id, updateNodesDto);
  }

  // elimina un experimento en particular
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.experimentsService.remove(+id);
  }
}
