import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getBusinessSummaryChangesList } from './constant';

import type { BusinessSummaryChangesListRequest, BusinessSummaryChangesListResponse } from './constant';
import type { UseQueryOptions } from '@tanstack/react-query';

/**
 * Custom hook untuk fetch business summary changes list
 */
const useGetBusinessSummaryChangesList = (
  payload: BusinessSummaryChangesListRequest,
  config?: Partial<UseQueryOptions<any>>
) => {
  const query = useQuery<any>({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      return await getBusinessSummaryChangesList(payload);
    },
    queryKey: ['business-summary-changes-list', payload],
    ...config,
  });

  return query;
};

export default useGetBusinessSummaryChangesList;
