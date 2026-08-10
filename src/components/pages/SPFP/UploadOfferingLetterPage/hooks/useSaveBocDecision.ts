import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BocDecisionControllerApi } from '@/services/openapi/agreement-service';

import type { TypeModule, TypeProcess } from '@/enums/Module';


type SaveDto = {
  bucketProcessId: string;
  description: string;
  process: TypeProcess;
  module: TypeModule;
  bocDate: string;
}

const api = new BocDecisionControllerApi();

const useSaveBocDecision = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ bucketProcessId, process, module, description, bocDate }: SaveDto) => {
      const res = await api.saveBocDecisions({ bocDate, bucketProcessId, description, module, process });

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ['upload-offering-letter', { bucketProcessId: variable.bucketProcessId }]});
      onSuccess();
    },
  });

  return mutation;
};


export default useSaveBocDecision;
