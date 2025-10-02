/* eslint-disable */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UpdateCrudDto } from './dto/update-crud.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CrudService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Handles Prisma errors and throws appropriate HTTP exceptions
   */
  private handlePrismaError(error: any, customMessage?: string): never {
    // PrismaClientKnownRequestError - errors with specific error codes
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2000':
          throw new BadRequestException(
            customMessage || 'The provided value for the column is too long'
          );
        case 'P2001':
          throw new NotFoundException(
            customMessage || 'The record searched for does not exist'
          );
        case 'P2002':
          throw new ConflictException(
            `Unique constraint violation: ${error.meta?.target || 'field'} already exists`
          );
        case 'P2003':
          throw new BadRequestException(
            customMessage || 'Foreign key constraint failed'
          );
        case 'P2004':
          throw new BadRequestException(
            customMessage || 'A constraint failed on the database'
          );
        case 'P2005':
          throw new BadRequestException(
            customMessage ||
              `Invalid value stored in the database: ${error.meta?.field_value}`
          );
        case 'P2006':
          throw new BadRequestException(
            customMessage || `Invalid value provided: ${error.meta?.field_name}`
          );
        case 'P2007':
          throw new BadRequestException(
            customMessage || 'Data validation error'
          );
        case 'P2008':
          throw new InternalServerErrorException(
            customMessage || 'Failed to parse the query'
          );
        case 'P2009':
          throw new InternalServerErrorException(
            customMessage || 'Failed to validate the query'
          );
        case 'P2010':
          throw new InternalServerErrorException(
            customMessage || 'Raw query failed'
          );
        case 'P2011':
          throw new BadRequestException(
            customMessage || 'Null constraint violation'
          );
        case 'P2012':
          throw new BadRequestException(
            customMessage || 'Missing a required value'
          );
        case 'P2013':
          throw new BadRequestException(
            customMessage || 'Missing a required argument'
          );
        case 'P2014':
          throw new BadRequestException(
            customMessage ||
              'The change would violate the required relation between models'
          );
        case 'P2015':
          throw new NotFoundException(
            customMessage || 'A related record could not be found'
          );
        case 'P2016':
          throw new BadRequestException(
            customMessage || 'Query interpretation error'
          );
        case 'P2017':
          throw new BadRequestException(
            customMessage || 'The records for relation are not connected'
          );
        case 'P2018':
          throw new NotFoundException(
            customMessage || 'The required connected records were not found'
          );
        case 'P2019':
          throw new BadRequestException(customMessage || 'Input error');
        case 'P2020':
          throw new BadRequestException(
            customMessage || 'Value out of range for the type'
          );
        case 'P2021':
          throw new NotFoundException(
            customMessage || 'The table does not exist in the current database'
          );
        case 'P2022':
          throw new NotFoundException(
            customMessage || 'The column does not exist in the current database'
          );
        case 'P2023':
          throw new BadRequestException(
            customMessage || 'Inconsistent column data'
          );
        case 'P2024':
          throw new InternalServerErrorException(
            customMessage ||
              'Timed out fetching a new connection from the connection pool'
          );
        case 'P2025':
          throw new NotFoundException(
            customMessage ||
              'Record to update or delete does not exist. Operation failed'
          );
        case 'P2026':
          throw new BadRequestException(
            customMessage ||
              'The current database provider does not support a feature used in the query'
          );
        case 'P2027':
          throw new InternalServerErrorException(
            customMessage ||
              'Multiple errors occurred on the database during query execution'
          );
        case 'P2028':
          throw new InternalServerErrorException(
            customMessage || 'Transaction API error'
          );
        case 'P2030':
          throw new BadRequestException(
            customMessage || 'Cannot find a fulltext index to use for the search'
          );
        case 'P2033':
          throw new BadRequestException(
            customMessage ||
              'A number used in the query does not fit into a 64-bit signed integer'
          );
        case 'P2034':
          throw new ConflictException(
            customMessage || 'Write conflict occurred while saving to the database'
          );
        default:
          throw new InternalServerErrorException(
            customMessage || `Database error: ${error.code} - ${error.message}`
          );
      }
    }

    // PrismaClientUnknownRequestError - errors without specific error codes
    if (error instanceof Prisma.PrismaClientUnknownRequestError) {
      throw new InternalServerErrorException(
        customMessage || 'An unknown database error occurred'
      );
    }

    // PrismaClientRustPanicError - errors from the Prisma engine crashing
    if (error instanceof Prisma.PrismaClientRustPanicError) {
      throw new InternalServerErrorException(
        customMessage || 'Database engine crashed'
      );
    }

    // PrismaClientInitializationError - errors related to connection/initialization
    if (error instanceof Prisma.PrismaClientInitializationError) {
      throw new InternalServerErrorException(
        customMessage || 'Failed to initialize database connection'
      );
    }

    // PrismaClientValidationError - errors from invalid Prisma Client queries
    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new BadRequestException(
        customMessage || 'Invalid query parameters provided'
      );
    }

    // NotFoundError - thrown by findXOrThrow methods
    // Check by error name since NotFoundError is not exported by Prisma
    if (error?.name === 'NotFoundError') {
      throw new NotFoundException(
        customMessage || 'The requested record was not found'
      );
    }

    // Default error handling for unknown errors
    console.error('Unhandled error:', error);
    throw new InternalServerErrorException(
      customMessage || 'An unexpected error occurred'
    );
  }

  async create(body: any, model: string) {
    try {
      return await this.prismaService[model].create({
        data: body,
      });
    } catch (error) {
      this.handlePrismaError(error, `Failed to create ${model}`);
    }
  }

  async findAll(model: string) {
    try {
      return await this.prismaService[model].findMany({
        orderBy: {
          id: 'asc',
        },
      });
    } catch (error) {
      this.handlePrismaError(error, `Failed to fetch ${model} records`);
    }
  }

  async findOne(id: number, model: string) {
    try {
      const record = await this.prismaService[model].findFirst({
        where: { id },
      });
      if (!record) {
        throw new NotFoundException(`${model} with ID ${id} not found`);
      }
      return record;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.handlePrismaError(error, `Failed to fetch ${model} with ID ${id}`);
    }
  }

  async update(id: number, updateCrudDto: UpdateCrudDto, model: string) {
    try {
      return await this.prismaService[model].update({
        where: { id },
        data: updateCrudDto,
      });
    } catch (error) {
      this.handlePrismaError(error, `Failed to update ${model} with ID ${id}`);
    }
  }

  async remove(id: number, model: string) {
    try {
      const response = await this.prismaService[model].delete({
        where: { id },
      });
      return { ...response, success: true };
    } catch (error) {
      this.handlePrismaError(error, `Failed to delete ${model} with ID ${id}`);
    }
  }

  async findAllByWhere(model: string, body: any) {
    try {
      const findClause: any = {};
      if (body.where) {
        findClause.where = body.where;
      }
      if (body.include) {
        findClause.include = body.include;
      }
      findClause.orderBy = {
        id: 'asc',
      };
      return await this.prismaService[model].findMany(findClause);
    } catch (error) {
      this.handlePrismaError(error, `Failed to fetch ${model} records with filters`);
    }
  }

  async search(query: string, model: string, data: any) {
    try {
      const whereClause: any = {};
      const search = data?.map((item) => {
        return {
          [item?.value]: { contains: query, mode: 'insensitive' },
        };
      });
      if (search.length) {
        whereClause.OR = search;
      }
      const searchResults = await this.prismaService[model].findMany({
        where: whereClause,
        orderBy: { id: 'asc' },
      });
      return searchResults;
    } catch (error) {
      this.handlePrismaError(error, `Failed to search ${model}`);
    }
  }
}
