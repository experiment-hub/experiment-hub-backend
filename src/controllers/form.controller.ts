import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  HttpStatus,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { FormService } from '../services/form.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FormDto } from 'src/dtos/form.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FormEntity } from 'src/entities/form.entity';

@Controller('teams')
@ApiTags('forms')
export class FormController {
  constructor(private readonly formService: FormService) {}

  @Post(':teamId/forms')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: FormEntity })
  async createForm(
    @Param('teamId') teamId: number,
    @Body() createFormDto: FormDto,
  ) {
    try {
      console.log('DTO:', createFormDto);
      console.log('Team Id:', teamId);
      createFormDto.teamId = teamId;
      const newForm = await this.formService.createForm(createFormDto);
      return newForm;
    } catch (error) {
      throw new HttpException(
        `An error occurred while creating the form: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':teamId/forms/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: FormEntity })
  async getForm(@Param('teamId') teamId: number, @Param('id') id: string) {
    try {
      return this.formService.getFormById(+id);
    } catch (error) {
      throw new HttpException(
        `An error occurred while finding the form: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':teamId/forms/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: FormEntity })
  async updateForm(
    @Param('teamId') teamId: number,
    @Param('id') id: string,
    @Body() updateFormDto: FormDto,
  ) {
    try {
      return this.formService.updateForm(+id, updateFormDto);
    } catch (error) {
      throw new HttpException(
        `An error occurred while updating the form: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':teamId/forms')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: FormEntity, isArray: true })
  async listForms(@Param('teamId') teamId: number) {
    try {
      return this.formService.listForms(teamId);
    } catch (error) {
      throw new HttpException(
        `An error occurred while finding forms: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
