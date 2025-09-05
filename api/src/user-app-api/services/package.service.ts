import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { QueryDto } from 'src/user/dto/query.dto';
import { CreatePackageDto, UpdatePackageDto } from '../dtos/packages.dto';

@Injectable()
export class PackagesService {
  constructor(private prismaService: PrismaService) { }

  async findAll(query: QueryDto) {
    const where: any = {};

    if (query.search) {
      where.OR = [
        {
          name: {
            contains: query.search,
            mode: 'insensitive',
          },
        }
      ];
    }

    const packages = await this.prismaService.package.findMany({
      where,
      orderBy: {
        sort_order: 'asc',
      }
    })

    const center = await this.prismaService.examCenter.findMany({
      where: { is_active: true },
      orderBy: { sort_order: "asc" }
    })

    return {
      packages,
      center
    }
  }

  async findAllExamCenter() {
    return this.prismaService.examCenter.findMany({
      where: { is_active: true },
      orderBy: { sort_order: "asc" }
    })
  }

  // create(data: CreatePackageDto) {
  //   return this.prismaService.package.create({ data });
  // }

  findOne(id: number) {
    return this.prismaService.package.findFirst({ where: { id } });
  }

  update(id: number, data: UpdatePackageDto) {
    return this.prismaService.package.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prismaService.package.delete({ where: { id } });
  }
}