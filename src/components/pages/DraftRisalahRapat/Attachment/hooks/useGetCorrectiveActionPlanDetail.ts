import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { CorrectiveActionPlanControllerApi } from '@/services/openapi/agreement-service';

import type { RequestByIdDtoLong } from '@/services/openapi/agreement-service';


const api = new CorrectiveActionPlanControllerApi();

const useGetCorrectiveActionPlanDetail = (payload: RequestByIdDtoLong) => {
  const query = useQuery({
    initialData: {},
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getDetailCorrectiveActionPlan(payload);

      return res.data.data.content;
    },
    queryKey: ['get-corrective-action-plan-bucket', {
      ...payload,
    }],
  });

  return query;
};

export default useGetCorrectiveActionPlanDetail;
