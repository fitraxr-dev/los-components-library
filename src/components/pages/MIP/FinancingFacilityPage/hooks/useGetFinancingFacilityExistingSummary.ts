import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


interface FinancingFacilityExistingSummaryFilter {
  debtorId: string;
  [key: string]: unknown;
}

interface FinancingFacilityExistingSummaryRequest {
  filter: FinancingFacilityExistingSummaryFilter;
  page: {
    itemPerPage: number;
    noPage: number;
  };
  searchDetail?: string;
  sortList?: string;
}

export interface FinancingFacilityExistingSummaryItem {
  callType?: string;
  plafond?: {
    usd?: string;
    idr?: string;
  };
  os?: {
    usd?: string;
    idr?: string;
  };
  [key: string]: unknown;
}

interface FinancingFacilityExistingSummaryResponse {
  contents: FinancingFacilityExistingSummaryItem[];
  page?: {
    noPage?: number;
    itemPerPage?: number;
    totalPage?: number;
    totalData?: number;
  };
  [key: string]: unknown;
}

const useGetFinancingFacilityExistingSummary = (
  payload: FinancingFacilityExistingSummaryRequest,
  config?: Partial<UseQueryOptions<FinancingFacilityExistingSummaryResponse>>
) => {
  const query = useQuery<FinancingFacilityExistingSummaryResponse>({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('bucket.financialFacility.existLosSummary', {
        data: payload,
      });

      const response = res?.data?.data as FinancingFacilityExistingSummaryResponse | undefined;

      return response ?? { contents: [], page: undefined };
    },
    queryKey: ['financingFacilitiesExistingSummary', payload],
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

export default useGetFinancingFacilityExistingSummary;
