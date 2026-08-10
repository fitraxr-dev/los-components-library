import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { GenericBucketRequestDto } from '@/helpers/api/types';


export interface SummaryChangesListFilterRequest {
  module?: string;
  bucketProcessId?: string;
  action?: 'ADD' | 'UPDATE';
}

const useGetSummaryChangesList = (
  payload: GenericBucketRequestDto<SummaryChangesListFilterRequest>,
  options?: { enabled?: boolean }
) => {
  const query = useQuery({
    enabled: options?.enabled ?? true,
    queryFn: async () => {
      const res = await API('parameter.parameterLov.summaryChangesList', {
        data: payload,
      });
      return res.data?.data;
    },
    queryKey: ['parameter-lov-summary-changes-list', payload],
  });
  return query;
};

export default useGetSummaryChangesList;
