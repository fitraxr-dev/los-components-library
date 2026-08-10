import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CorrectiveActionPlanControllerApi } from '@/services/openapi/mip-service';

import type { RequestByIdDtoLong } from '@/services/openapi/mip-service';


const api = new CorrectiveActionPlanControllerApi();


const useDeleteSubData = ({
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
      queryClient.invalidateQueries({ queryKey: ['get-corrective-action-plan-bucket']});
      onSuccess();
    },
  });

  return mutation;
};

export default useDeleteSubData;
