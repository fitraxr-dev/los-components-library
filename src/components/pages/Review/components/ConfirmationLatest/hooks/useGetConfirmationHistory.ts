import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { ConfirmationHistoryControllerApi } from '@/services/openapi/mip-service';

import type { ConfirmationHistoryResponseDto, RequestByProcessIdDtoString } from '@/services/openapi/mip-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new ConfirmationHistoryControllerApi();

const useGetConfirmationHistory = (
  payload: RequestByProcessIdDtoString,
  config?: Partial<UseQueryOptions<ConfirmationHistoryResponseDto>>

) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getLatestConfirmation(payload);

      return res.data.data.content;
    },
    queryKey: ['confirmation-history-latests', payload],
    ...config,
  });

  return query;
};

export default useGetConfirmationHistory;
