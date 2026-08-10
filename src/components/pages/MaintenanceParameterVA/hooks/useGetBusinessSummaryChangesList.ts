import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getBusinessSummaryChangesList } from './constant/getBusinessSummaryChangesList';

import type {
  BusinessSummaryChangesListRequest,
  BusinessSummaryChangesListResponse,
} from './constant/getBusinessSummaryChangesList';
import type { UseQueryOptions } from '@tanstack/react-query';

/**
 * Custom hook untuk fetch business summary changes list
 */
const useGetBusinessSummaryChangesList = (
  payload: BusinessSummaryChangesListRequest,
  config?: Partial<UseQueryOptions<any>>
) => {
  const query = useQuery<any>({
    queryFn: async () => {
      return await getBusinessSummaryChangesList(payload);
    },
    queryKey: config?.queryKey || ['business-summary-changes-list-va', payload],
    staleTime: 0,
    ...config,
  });

  return query;
};

export default useGetBusinessSummaryChangesList;
