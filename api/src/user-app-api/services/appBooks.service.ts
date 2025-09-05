import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BookResponseDto } from '../dtos/book.dto';

@Injectable()
export class BookApiService {
  constructor(private readonly prismaService: PrismaService) { }

  async findBookList(): Promise<BookResponseDto[]> {
    try {
      const books = await this.prismaService.book.findMany({
        where: {
          is_available: true // Only return available books by default
        },
        orderBy: {
          title: 'asc'
        }
      });
      return books;
    } catch (error) {
      throw new Error(`Failed to fetch books: ${error.message}`);
    }
  }

  async findOne(id: number): Promise<BookResponseDto | null> {
    try {
      const book = await this.prismaService.book.findFirst({ 
        where: { id } 
      });
      
      if (!book) {
        throw new NotFoundException(`Book with ID ${id} not found`);
      }
      
      return book;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to fetch book: ${error.message}`);
    }
  }
}