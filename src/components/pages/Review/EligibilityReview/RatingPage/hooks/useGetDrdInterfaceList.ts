import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


interface PageRequestDto {
  noPage?: number;
  itemPerPage?: number;
}

interface SortRequestDto {
  columnName?: string;
  sortType?: string;
}

interface SearchDetailRequestDto {
  key?: string;
  value?: string;
}

interface GenericBucketRequestDtoDocumentTypeRequestDto {
  page?: PageRequestDto;
  sortList?: SortRequestDto;
  searchDetail?: SearchDetailRequestDto;
  filter?: any;
  bucketProcessId?: any;
}


const useGetDrdInterfaceList = (
  payload: GenericBucketRequestDtoDocumentTypeRequestDto,
  config?: Partial<UseQueryOptions<any, Error, any>>
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('bucketDocument.document.drdInterfaceList', {
        data: payload,
      });

      return res?.data?.data ?? {};
    },
    queryKey: ['drd-interace-list', payload],
    ...config,
  });

  return query;
};

export default useGetDrdInterfaceList;
