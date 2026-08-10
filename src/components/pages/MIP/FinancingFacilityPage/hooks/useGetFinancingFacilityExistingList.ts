import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


interface FinancingFacilityExistingFilter {
  debtorId: string;
  [key: string]: unknown;
}

interface FinancingFacilityExistingRequest {
  filter: FinancingFacilityExistingFilter;
  page: {
    itemPerPage: number;
    noPage: number;
  };
  searchDetail?: string;
  sortList?: string;
}

interface FinancingFacilityExistingResponse {
  contents: Array<Record<string, unknown>>;
  page?: Record<string, unknown>;
  [key: string]: unknown;
}

const useGetFinancingFacilityExistingList = (
  payload: FinancingFacilityExistingRequest,
  config?: Partial<UseQueryOptions<FinancingFacilityExistingResponse>>
) => {
  const query = useQuery<FinancingFacilityExistingResponse>({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('bucket.financialFacility.existLos', {
        data: payload,
      });

      return res.data.data as FinancingFacilityExistingResponse;
    },
    queryKey: [
      'financingFacilitiesExisting',
      payload,
    ],
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

export default useGetFinancingFacilityExistingList;
