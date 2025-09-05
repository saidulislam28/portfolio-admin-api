/*eslint-disable */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Role } from '../user-auth/dto/role.enum';
import { HasRoles } from '../user-auth/jwt/has-roles.decorator';
import { JwtAuthGuard } from '../user-auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../user-auth/jwt/roles.guard';
import { CrudService } from './crud.service';

@HasRoles(Role.Admin)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('crud')
export class CrudController {
  constructor(private readonly crudService: CrudService) {}

  //TODO validate model name
  //TODO validate request body based on model
  @Post()
  create(@Body() body: any, @Query('model') model: string) {
    return this.crudService.create(body, model);
  }

  @Get()
  findAll(@Query('model') model: string) {
    return this.crudService.findAll(model);
  }

  @Post('find-where')
  findAllByWhere(@Query('model') model: string, @Body() body: any) {
    return this.crudService.findAllByWhere(model, body);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('model') model: string) {
    return this.crudService.findOne(+id, model);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCrudDto: any,
    @Query('model') model: string,
  ) {
    return this.crudService.update(+id, updateCrudDto, model);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Query('model') model: string) {
    return this.crudService.remove(+id, model);
  }

  @Post('find/search')
  async search(@Query('query') query, @Query('model') model, @Body() data) {
    return this.crudService.search(query, model, data);
  }
}
