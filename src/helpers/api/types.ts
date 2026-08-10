export type PageRequestDto = {
  noPage?: number;
  itemPerPage?: number;
}

export type SortRequestDto = {
  columnName?: string;
  sortType?: string;
}

export type SearchDetailRequestDto = {
  key?: string;
  value?: string;
}

export type PageResponseDto = {
  noPage?: number;
  itemPerPage?: number;
  totalPage?: number;
  totalData?: number;
}

export interface GenericBucketRequestDto<TFilter = unknown> {
  page?: PageRequestDto;
  sortList?: SortRequestDto;
  searchDetail?: SearchDetailRequestDto;
  filter?: TFilter;
}

export interface GenericBucketResponseDto<TData = unknown> {
  operationId?: string;
  errorCode?: string;
  errorDesc?: string;
  errorSource?: string;
  errorDetail?: string;
  timestamp?: string;
  data?: {
    content?: TData;
    contents?: TData[];
    page?: PageResponseDto;
  };
}
