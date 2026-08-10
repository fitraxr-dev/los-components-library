import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


export interface Analyst {
  id: string;
  name: string;
}

export interface Debtor {
  id: number;
  name: string;
  region_id: string | null;
}

export interface AnnualReview {
  id: number;
  memoDate: string | null;
  debtorId: number | null;
  duration: number;
}

export interface RatingHistoryItem {
  id: number;
  analyst: Analyst;
  debtor: Debtor;
  division: string;
  is_copy_rating: boolean;
  memo_date: string;
  memo_number: string;
  name: string;
  period: string;
  rating_result: string;
  rating_type: string;
  pic_id?: string;
  facility_number?: string;
  created_at?: string;
  updated_at?: string;
  memoNumber?: string;
  annual_review?: AnnualReview[];
}

export interface RatingHistoryResponse {
  content: RatingHistoryItem[];
  page: {
    totalPage: number;
    noPage: number;
    itemPerPage: number;
    totalItem: number;
  };
}

interface RatingHistoryPayload {
  debtorName?: string;
  debtorId?: number;
  debtorCode?: string;
  module?: string;
  process?: string;
  page?: {
    itemPerPage: number;
    noPage: number;
  };
}

const useGetRatingHistory = (
  payload: RatingHistoryPayload,
  config?: Partial<UseQueryOptions<RatingHistoryResponse>>
) => {
  const query = useQuery<RatingHistoryResponse>({
    enabled: !!payload.debtorId,
    placeholderData: keepPreviousData,

    queryFn: async () => {
      const res = await API('bucketDocument.document.ratingHistory', {
        data: payload,
      });

      return res.data?.data ?? {};
    },
    queryKey: ['rating-history', payload],
    ...config,
  });

  return query;
};

export default useGetRatingHistory;
