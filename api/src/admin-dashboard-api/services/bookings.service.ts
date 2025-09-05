/* eslint-disable */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
// import { Booking } from '@prisma/client';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) { }

  async findAll(query) {

    const where: any = {}

    if (query.search) {
      where.OR = [
        {
          notes: {
            contains: query.search,
            mode: 'insensitive'
          }
        },
        {
          token: {
            contains: query.search,
            mode: 'insensitive'
          }
        },
        {
          consultant_id: {
            contains: query.search,
            mode: 'insensitive'
          }
        },
        {
          user_id: {
            contains: query.search,
            mode: 'insensitive'
          }
        },

      ]
    }


    // return await this.prisma.booking.findMany({
    //   include: {
    //     User: {
    //       select: {
    //         full_name: true,
    //         id: true
    //       }
    //     },
    //     Consultant: true,
    //     BookingHistory: true
    //   }, where
    // })
  }

  // async findOne(id: number): Promise<Booking | null> {
  //   return await this.prisma.booking.findFirst({
  //     where: { id },
  //     include: {
  //       User: {
  //         select: {
  //           full_name: true,
  //           id: true
  //         }
  //       },
  //       Consultant: true,
  //       BookingHistory: true
  //     }
  //   });
  // }


  // async updateOne(id: number, updateData) {
  //   return await this.prisma.booking.update({ where: { id }, data: updateData })
  // }




}