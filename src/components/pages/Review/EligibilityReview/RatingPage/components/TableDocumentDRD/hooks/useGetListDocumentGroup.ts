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
}

const isDocumentListContainsNull = (data: any) => {
  if (data && data.contents) {
    return data.contents.some((item: any) => item.isSuccessUpload === false);
  }
  return true;
};

const useGetListDocumentGroup = (
  payload: GenericBucketRequestDtoDocumentTypeRequestDto,
  config?: Partial<UseQueryOptions<any, Error, any>>
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('bucketDocument.document.getOtherDocumentGroup', {
        data: payload,
      });

      return res?.data?.data ?? {};
    },
    queryKey: [
      'get-document-group',
    ],
    refetchInterval: (query) => (isDocumentListContainsNull(query.state.data) ? 5000 : false),
    ...config,
  });

  return query;
};

export default useGetListDocumentGroup;
