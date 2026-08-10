import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CorrectiveActionPlanControllerApi } from '@/services/openapi/agreement-service';


const api = new CorrectiveActionPlanControllerApi();

interface SaveBusinessResponseDto {
  bucketProcessId: string;
  process: string;
  module: string;
  id?: number;
  ess?: string;
  description?: any;
  descriptionList?: string;
}

const useSaveCorrectiveActionPlan = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: SaveBusinessResponseDto) => {
      const { bucketProcessId, process, module, id, ess, description, descriptionList } = payload;
      const res = await api.saveCorrectiveActionPlan(
        bucketProcessId,
        process,
        module,
        id,
        ess,
        description,
        descriptionList
      );

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ['get-list-corrective-action-plan-bucket']});
      queryClient.invalidateQueries({ queryKey: ['get-corrective-action-plan-detail', variable.id]});
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveCorrectiveActionPlan;
