import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


type Payload = {
  bucketProcessId: string;
  module: string;
  process: string;
}

type ResponseContent = {
  missingInChildFacilityIds: string[];
  missingInParentFacilityIds: string[];
  changedFacilityFields: Record<string, any>;
  hasAnyDifference: boolean;
}

const useGetFinancingFacilityDiff = (
  payload: Payload,
  config?: Partial<UseQueryOptions<ResponseContent>>
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('bucket.financialFacility.checkDiff', {
        data: payload,
      });

      const content = res.data.data.content as any;
      const mapped: ResponseContent = {
        changedFacilityFields: content?.changedFacilityFields || {},
        hasAnyDifference: content?.hasAnyDifference === true,
        missingInChildFacilityIds: content?.missingInChildFacilityIds || [],
        missingInParentFacilityIds: content?.missingInParentFacilityIds || [],
      };
      return mapped;
    },
    queryKey: ['financing-facility-check-diff', payload],
    ...config,
  });

  return query;
};

export default useGetFinancingFacilityDiff;
