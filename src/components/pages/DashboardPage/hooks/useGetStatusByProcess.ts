import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { InquiryControllerApi } from '@/services/openapi/dashboard-service';

import type { GenericListDtoStatusResponseDto, StatusRequestDto } from '@/services/openapi/dashboard-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new InquiryControllerApi();

const useGetStatusByProcess = (
  payload: StatusRequestDto,
  config?: Partial<UseQueryOptions<GenericListDtoStatusResponseDto>>
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getStatus(payload);

      return res.data.data;
    },

    queryKey: ['status', payload],
    // select: (data: GenericListDtoStatusResponseDto) => data,
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

export default useGetStatusByProcess;
