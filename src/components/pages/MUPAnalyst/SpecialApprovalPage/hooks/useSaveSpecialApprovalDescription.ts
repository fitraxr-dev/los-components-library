import { useMutation, useQueryClient } from '@tanstack/react-query';

import { SpecialApprovalControllerApi } from '@/services/openapi/mip-service';

import type { TypeModule, TypeProcess } from '@/enums/Module';


type SaveDto = {
  bucketProcessId: string;
  description?: any;
  module: TypeModule;
  process: TypeProcess;
  title?: string;
}

const api = new SpecialApprovalControllerApi();

const useSaveSpecialApprovalDescription = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ bucketProcessId, description, process, module, title }: SaveDto) => {
      const res = await api.saveSpecialApproval(bucketProcessId, process, module, description, title);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
      queryClient.invalidateQueries({
        queryKey: ['special-approval-description',
          {
            bucketProcessId: variable.bucketProcessId,
            module: variable.module,
            process: variable.process,
          }]});
      onSuccess();
    },
  });

  return mutation;
};


export default useSaveSpecialApprovalDescription;
