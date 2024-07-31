export interface ResultWithPagination<R> {
  result: R;
  pagination: Pagination & { total: number };
}

export interface Pagination {
  limit: number;
  offset: number;
}
