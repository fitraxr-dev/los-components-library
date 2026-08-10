import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getBusinessSummary } from './constant';

import type { BusinessSummaryRequest, BusinessSummaryResponse } from './constant';
import type { UseQueryOptions } from '@tanstack/react-query';

/**
 * Custom hook untuk fetch business summary list
 */
const useGetBusinessSummary = (
  payload: BusinessSummaryRequest | null,
  config?: Partial<UseQueryOptions<any>>
) => {
  const query = useQuery<any>({
    enabled: !!payload,
    placeholderData: keepPreviousData,

    queryFn: async () => {
      if (!payload) {
        throw new Error('Payload is required');
      }
      return await getBusinessSummary(payload);
    },

    queryKey: ['business-summary', payload?.filter?.bucketProcessId, payload?.filter?.module, payload?.page, payload?.filter, payload?.searchDetail, payload?.sortList],
    ...config,
  });

  return query;
};

export default useGetBusinessSummary;
