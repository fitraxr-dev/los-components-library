import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CorrectiveActionPlanControllerApi } from '@/services/openapi/agreement-service';

import type { RequestByIdDtoLong } from '@/services/openapi/agreement-service';


const api = new CorrectiveActionPlanControllerApi();


const useDeleteCorrectiveActionPlan = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: RequestByIdDtoLong) => {
      const res = await api.deleteCorrectiveActionPlan(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ['get-list-corrective-action-plan-bucket']});
      onSuccess();
    },
  });

  return mutation;
};

export default useDeleteCorrectiveActionPlan;
