import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { CorrectiveActionPlanControllerApi } from '@/services/openapi/mip-service';

import type { CorrectiveActionPlanResponseDto, RequestByIdDtoLong } from '@/services/openapi/mip-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new CorrectiveActionPlanControllerApi();

interface CorrectiveActionPlanDetailDto {
  payload: RequestByIdDtoLong;
  config?: Partial<UseQueryOptions<CorrectiveActionPlanResponseDto>>;
}

const useGetCorrectiveActionPlanDetail = ({ payload, config }: CorrectiveActionPlanDetailDto) => {
  const query = useQuery({
    initialData: {},
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getDetailCorrectiveActionPlan(payload);

      return res.data.data.content;
    },
    queryKey: ['get-corrective-action-plan-bucket-detail', {
      ...payload,
    }],
    ...config,
  });

  return query;
};

export default useGetCorrectiveActionPlanDetail;
