import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { CorrectiveActionPlanControllerApi } from '@/services/openapi/agreement-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/agreement-service';


const api = new CorrectiveActionPlanControllerApi();

const useGetCorrectiveActionPlanList = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    initialData: {},
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getListCorrectiveActionPlan(payload);

      return res.data.data.content;
    },
    queryKey: ['get-list-corrective-action-plan-bucket', {
      ...payload,
    }],
  });

  return query;
};

export default useGetCorrectiveActionPlanList;
