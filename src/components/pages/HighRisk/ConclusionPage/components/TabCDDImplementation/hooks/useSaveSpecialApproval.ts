import { useMutation, useQueryClient } from '@tanstack/react-query';

import { SpecialApprovalControllerApi } from '@/services/openapi/mip-service';


const api = new SpecialApprovalControllerApi();

type Payload = {
  bucketProcessId: string;
  module: string;
  process: string;
  description?: any;
  title?: string;
}
const useSaveSpecialApproval = ({
  onError = () => {},
  onSuccess = () => {},
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({ bucketProcessId, process, module, description, title }: Payload) => {
      const res = await api.saveSpecialApproval(bucketProcessId, process, module, description, title);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['special-approval', {
        bucketProcessId: variables.bucketProcessId,
        module: variables.module,
        process: variables.process,
      }]});
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveSpecialApproval;
