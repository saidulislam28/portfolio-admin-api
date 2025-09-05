import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class PaginationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    //set default values of page and limit if not provided
    value.page = value.page ? value.page : 0;
    value.limit = value.limit ? value.limit : 10;

    return value;
  }
}
