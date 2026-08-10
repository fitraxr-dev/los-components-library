import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


export interface RatingHistoryItem {
  id: number;
  debtorName?: string;
  name?: string;
}

export interface RatingHistoryContent {
  contents: RatingHistoryItem[];
  page: {
    noPage: number;
    itemPerPage: number;
    totalPage: number;
    totalData: number;
  };
}

export interface RatingHistoryResponse {
  content: RatingHistoryContent;
}

interface RatingHistoryPayload {
  debtorName?: string;
  page?: {
    itemPerPage: number;
    noPage: number;
  };
  sortList?: any;
  searchDetail?: any;
  filter?: { [key: string]: object };
}

const useGetDebtorHistory = (
  payload: RatingHistoryPayload,
  config?: Partial<UseQueryOptions<RatingHistoryResponse>>
) => {
  const query = useQuery<RatingHistoryResponse>({
    enabled: !!payload.debtorName,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('bucketDocument.document.debtorRatingHistory', {
        data: payload,
      });

      return res.data?.data ?? {};
    },
    queryKey: ['debtor-rating-history', payload],
    ...config,
  });

  return query;
};

export default useGetDebtorHistory;
