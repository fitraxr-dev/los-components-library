import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { ListCollateralResponseDto } from '@/services/openapi/lpa-service';
import type { UseQueryOptions } from '@tanstack/react-query';


interface CollateralSearchPayload {
  bucketProcessId: string;
  id: string;
  module: string;
  process: string;
  requestSearch: {
    filter: {
      type?: string[];
      [key: string]: any;
    };
    sortList?: any[];
    search?: string;
    [key: string]: any;
  };
}

const useGetCollateralListSearch = (
  payload: CollateralSearchPayload,
  config?: Partial<UseQueryOptions<ListCollateralResponseDto>>
) => {
  const queries = useQuery({
    enabled: !!payload && !!payload.bucketProcessId && !!payload.id,
    queryFn: async () => {
      const response = await API('lpa.collateral.search', {
        data: payload,
      });

      return response.data.data;
    },
    queryKey: ['collateral-list-search', payload],
    ...config,
  });

  return queries;
};

export default useGetCollateralListSearch;
