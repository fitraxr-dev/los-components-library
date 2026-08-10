import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


export interface PageResponseDto {
  noPage?: number;
  itemPerPage?: number;
  totalPage?: number;
  totalData?: number;
}

export interface PageRequestDto {
  noPage?: number;
  itemPerPage?: number;
}

export interface SortRequestDto {
  columnName?: string;
  sortType?: string;
}

export interface SearchDetailRequestDto {
  key?: string;
  value?: string;
}

export interface GenericBucketRequestDtoMapStringObject {
  page?: PageRequestDto;
  sortList?: SortRequestDto;
  searchDetail?: SearchDetailRequestDto;
  filter?: { [key: string]: object };
}

export interface ReportItemResponseDto {
  id?: number;
  report?: string;
  isQuarterly?: boolean | null;
  isSemester?: boolean | null;
  isAnnual?: boolean | null;
  isOther?: boolean | null;
  deadlineOther?: string | null;
  remark?: string;
  grade?: string | null;
  sequence?: number;
  allowSubReport?: boolean;
}

export interface GenericReportResponseDto {
  contents?: Array<ReportItemResponseDto>;
  page?: PageResponseDto;
}

const useGetReportList = (
  payload: GenericBucketRequestDtoMapStringObject,
  config?: Partial<UseQueryOptions<GenericReportResponseDto>>
) => {
  const query = useQuery<GenericReportResponseDto>({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('mip.routineReporting.componentList', {
        data: payload,
      });

      return res.data?.data ?? {};
    },
    queryKey: ['report-list', payload],
    ...config,
  });

  return query;
};

export default useGetReportList;
