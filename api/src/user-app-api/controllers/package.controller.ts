import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { res } from 'src/common/response.helper';
import { QueryDto } from 'src/user/dto/query.dto';

import { CreatePackageDto, ExamCenterResponseDto, PackageResponseDto, UpdatePackageDto } from '../dtos/packages.dto';
import { PackagesService } from '../services/package.service';

@ApiTags('User: Packages')
@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) { }

  @Get()
  @ApiOperation({ summary: 'Get all packages with pagination and filtering' })
  @ApiResponse({
    status: 200,
    description: 'Return paginated packages.',
    type: PackageResponseDto,
    isArray: true
  })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search term for package name' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
  async findAll(@Query() query: QueryDto) {
    const response = await this.packagesService.findAll(query);
    return res.success(response);
  }

  @Get('/exam-center')
  @ApiOperation({ summary: 'Get all active exam centers' })
  @ApiResponse({
    status: 200,
    description: 'Return all active exam centers.',
    type: ExamCenterResponseDto,
    isArray: true
  })
  async getExamCenter() {
    const response = await this.packagesService.findAllExamCenter();
    return res.success(response)
  }

  // @Post()
  // @ApiOperation({ summary: 'Create a new package' })
  // @ApiResponse({
  //   status: 201,
  //   description: 'Package successfully created.',
  //   type: PackageResponseDto
  // })
  // @ApiResponse({
  //   status: 400,
  //   description: 'Bad request'
  // })
  // @ApiBody({
  //   type: CreatePackageDto,
  //   description: 'Package data'
  // })
  // async create(@Body() data: CreatePackageDto) {
  //   const response = await this.packagesService.create(data);
  //   return res.success(response);
  // }

  @Get(':id')
  @ApiOperation({ summary: 'Get a package by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the package.',
    type: PackageResponseDto
  })
  @ApiResponse({
    status: 404,
    description: 'Package not found'
  })
  @ApiParam({ name: 'id', type: Number, description: 'Package ID' })
  async findOne(@Param('id') id: string) {
    const response = await this.packagesService.findOne(+id);
    return res.success(response)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a package' })
  @ApiResponse({
    status: 200,
    description: 'Package successfully updated.',
    type: PackageResponseDto
  })
  @ApiResponse({
    status: 404,
    description: 'Package not found'
  })
  @ApiParam({ name: 'id', type: Number, description: 'Package ID' })
  @ApiBody({
    type: UpdatePackageDto,
    description: 'Package update data'
  })
  async update(@Param('id') id: string, @Body() data: UpdatePackageDto) {
    const response = await this.packagesService.update(+id, data);
    return res.success(response);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a package' })
  @ApiResponse({
    status: 200,
    description: 'Package successfully deleted.',
    type: PackageResponseDto
  })
  @ApiResponse({
    status: 404,
    description: 'Package not found'
  })
  @ApiParam({ name: 'id', type: Number, description: 'Package ID' })
  async remove(@Param('id') id: string) {
    const response = await this.packagesService.remove(+id);
    return res.success(response);
  }
}