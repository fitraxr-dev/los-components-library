export type PaginationProps = {
  totalPage?: number;
  currentPage?: number;
  handlePageChange?: (page: number) => void;
  pageSize?: number;
  setPageSize?: (pageSize: number) => void;
  pageSizeOptions?: Array<number>;
}
