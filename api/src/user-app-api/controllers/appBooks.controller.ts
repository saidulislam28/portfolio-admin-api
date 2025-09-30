import {
  Controller,
  Get,
  Param,
  ParseIntPipe
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';
import { BookListResponseDto, BookResponseDto } from '../dtos/book.dto';
import { BookApiService } from '../services/appBooks.service';

@ApiTags('User: Books')
@Controller('app')
export class BookApiController {
  constructor(private readonly bookApiService: BookApiService) { }

  @Get('book')
  @ApiOperation({ 
    summary: 'Get all books', 
    description: 'Retrieve a list of all available books' 
  })
  @ApiOkResponse({ 
    description: 'List of books retrieved successfully',
    type: BookListResponseDto
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Internal server error' 
  })
  async findBookList() {
    const books = await this.bookApiService.findBookList();
    return {
      books,
      total: books.length
    };
  }

  @Get('book/:id')
  @ApiOperation({ 
    summary: 'Get book by ID', 
    description: 'Retrieve a specific book by its ID' 
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Book ID', 
    type: Number,
    example: 1 
  })
  @ApiOkResponse({ 
    description: 'Book retrieved successfully',
    type: BookResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Book not found' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid book ID format' 
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Internal server error' 
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const book = await this.bookApiService.findOne(id);
    
    if (!book) {
      return {
        success: false,
        message: 'Book not found',
        data: null
      };
    }
    
    return {
      success: true,
      data: book
    };
  }
}