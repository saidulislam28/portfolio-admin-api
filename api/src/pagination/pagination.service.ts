/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';

@Injectable()
export class PaginationService {
  getPaginationData = (page: number = 0, limit: number = 1, total: number) => {
    const offset = +page * +limit;
    const currentPage = +offset / +limit + 1;
    const totalPages = Math.ceil(+total / +limit);
    const hasNext = +totalPages > +currentPage;
    const hasPrevious = +currentPage > 1;
    const nextPage = hasNext ? +currentPage + 1 : null;
    const previousPage = hasPrevious ? +currentPage - 1 : null;

    return {
      limit,
      offset,
      currentPage,
      totalPages,
      nextPage,
      previousPage,
      hasNext,
      hasPrevious,
      total,
    };
  };

  getDataWithPagination = (data: any, pageAttr) => {
    const { limit, offset, ...paginationData } = this.getPaginationData(
      pageAttr.page,
      pageAttr.limit,
      pageAttr.total,
    );
    return {
      data,
      ...paginationData,
    };
  };
}
