import { HttpStatus } from '@nestjs/common';

export class res {
  static success(data: any, message: any = 'Success') {
    return {
      success: true,
      statusCode: HttpStatus.OK,
      message,
      data,
    };
  }

  static error(
    message: string = 'Internal Server Error',
    statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    return {
      statusCode,
      message,
    };
  }

}
