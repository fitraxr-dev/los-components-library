import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { CorrectiveActionPlanControllerApi } from '@/services/openapi/agreement-service';

import type { RequestByIdDtoLong } from '@/services/openapi/agreement-service';


const api = new CorrectiveActionPlanControllerApi();

const useGetCorrectiveActionPlanDetail = (payload: RequestByIdDtoLong) => {
  const query = useQuery({
    enabled: payload.id !== null,
    initialData: {},
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getDetailCorrectiveActionPlan(payload);

      return res.data.data.content;
    },
    queryKey: ['get-corrective-action-plan-detail', payload.id],
  });

  return query;
};

export default useGetCorrectiveActionPlanDetail;
