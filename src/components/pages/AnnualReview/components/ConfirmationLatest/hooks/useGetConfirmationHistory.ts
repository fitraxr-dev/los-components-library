import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


export interface RequestByProcessIdDtoString {
  bucketProcessId?: string;
  module?: string;
  process?: string;
}

export interface ConfirmationHistoryResponseDto {
  id?: number;
  parentProcessId?: string;
  parentProcess?: string;
  parentModule?: string;
  bucketProcessId?: string;
  process?: string;
  module?: string;
  isConfirmed?: boolean;
  selectedResponse?: boolean;
  remark?: string;
  additionalInformation?: string;
  diffs?: any;
  hasBusinessUpdate?: boolean;
}

const useGetConfirmationHistory = (
  payload: RequestByProcessIdDtoString,
  config?: Partial<
  UseQueryOptions<ConfirmationHistoryResponseDto>
  >
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const response = await API('mip.creditChecking.detailHistory', { data: payload });
      return response.data.data.content;
    },
    queryKey: ['confirmation-history-latests', payload],
    refetchInterval: 5000,
    ...config,
  });

  return query;
};

export default useGetConfirmationHistory;
