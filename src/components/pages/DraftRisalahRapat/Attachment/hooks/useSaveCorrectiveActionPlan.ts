import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CorrectiveActionPlanControllerApi } from '@/services/openapi/agreement-service';


const api = new CorrectiveActionPlanControllerApi();

interface SaveBusinessResponseDto {
  bucketProcessId: string; process: string; module: string; id?: number; ess?: string; businessResponse?: any;
}

const useSaveCorrectiveActionPlan = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: SaveBusinessResponseDto) => {
      const { bucketProcessId, process, module, id, ess, businessResponse } = payload;
      const res = await api.saveCorrectiveActionPlan(
        bucketProcessId,
        process,
        module,
        id,
        ess,
        businessResponse,
      );

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ['get-list-corrective-action-plan-bucket']});
      queryClient.invalidateQueries({ queryKey: ['get-corrective-action-plan-detail']});
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveCorrectiveActionPlan;
