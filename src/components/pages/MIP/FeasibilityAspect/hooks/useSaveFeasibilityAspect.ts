import { useMutation, useQueryClient } from '@tanstack/react-query';

import { FeasibilityAspectControllerApi } from '@/services/openapi/mip-service';


const api = new FeasibilityAspectControllerApi();

const useSaveFeasibilityAspect = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id, bucketProcessId, description, process, module }: SaveDto) => {
      const res = await api.saveFeasibilityAspect(bucketProcessId, process, module, description);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
      queryClient.invalidateQueries({ queryKey: ['mip-feasibility-aspect', { bucketProcessId: variable.bucketProcessId }]});
      onSuccess();
    },
  });

  return mutation;
};

type SaveDto = {
  id: number;
  bucketProcessId: string;
  description: any;
  module: string;
  process: string;
}

export default useSaveFeasibilityAspect;
