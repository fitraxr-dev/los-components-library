import { useMutation, useQueryClient } from '@tanstack/react-query';

import { PeerComparisonControllerApi } from '@/services/openapi/mip-service';

import type { TypeModule, TypeProcess } from '@/enums/Module';


type SaveDto = {
  bucketProcessId: string;
  description: any;
  module: TypeModule;
  process: TypeProcess;
}

const api = new PeerComparisonControllerApi();

const useSavePeerComparison = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ bucketProcessId, description, module, process }: SaveDto) => {
      const res = await api.savePeerComparison(bucketProcessId, process, module, description);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
      queryClient.invalidateQueries({ queryKey: ['mip-peer-comparison', { bucketProcessId: variable.bucketProcessId }]});
      onSuccess();
    },
  });

  return mutation;
};


export default useSavePeerComparison;
