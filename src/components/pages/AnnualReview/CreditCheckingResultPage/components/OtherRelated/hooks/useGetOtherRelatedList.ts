import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


interface OtherRelatedListPayload {
  bucketProcessId: string;
  tableType?: string;
  itemPerPage?: number;
  noPage?: number;
}

const useGetOtherRelatedList = (
  payload: OtherRelatedListPayload,
  config?: Partial<UseQueryOptions<any>>
) => {
  const query = useQuery({
    enabled: !!payload?.bucketProcessId,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const requestPayload = {
        filter: {
          bucketProcessId: payload.bucketProcessId,
          tableType: payload.tableType || '',
        },
        page: {
          itemPerPage: payload.itemPerPage || 10,
          noPage: payload.noPage || 1,
        },
      };

      const res = await API('creditChecking.result.otherRelated', { data: requestPayload });

      return res.data?.data?.contents;
    },
    queryKey: ['mns-other-related-list', payload],
    ...config,
  });

  return query;
};

export default useGetOtherRelatedList;
