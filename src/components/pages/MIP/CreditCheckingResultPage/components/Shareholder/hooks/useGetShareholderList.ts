import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


interface ShareholderListPayload {
  bucketProcessId: string;
  tableType?: string;
  itemPerPage?: number;
  noPage?: number;
}

const useGetShareholderList = (
  payload: ShareholderListPayload,
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

      const res = await API('creditChecking.result.shareholder', { data: requestPayload });

      return res.data?.data?.contents;
    },
    queryKey: ['mns-shareholder-list', payload],
    ...config,
  });

  return query;
};

export default useGetShareholderList;
