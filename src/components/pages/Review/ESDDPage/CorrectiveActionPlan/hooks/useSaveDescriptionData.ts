import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CorrectiveActionPlanControllerApi } from '@/services/openapi/mip-service';


const api = new CorrectiveActionPlanControllerApi();

interface SaveCorrectiveActionPlanDto {
  bucketProcessId: string;
  process: string;
  module: string;
  id?: number;
  ess?: string;
  description?: any;
  descriptionList?: string;
}
const useSaveDescriptionData = ({
  onSuccess = (data: any) => {},
  onError = (error: any) => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      bucketProcessId,
      process,
      module,
      id,
      ess,
      description,
      descriptionList,
    }: SaveCorrectiveActionPlanDto) => {
      const res = await api.saveCorrectiveActionPlan(
        bucketProcessId,
        process,
        module,
        id,
        ess,
        description,
        descriptionList,
      );

      return res.data.data.content;
    },
    onError: (error) => {
      onError(error);
    },
    onSuccess: (data, variable) => {
      queryClient.invalidateQueries({ queryKey: ['get-corrective-action-plan-bucket-detail']});
      onSuccess(data);
    },
  });

  return mutation;
};

export default useSaveDescriptionData;
