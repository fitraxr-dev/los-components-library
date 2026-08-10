import { useMutation, useQueryClient } from '@tanstack/react-query';

import { SpecialApprovalTypeControllerApi } from '@/services/openapi/mip-service';

import type { RequestByIdDtoLong } from '@/services/openapi/mip-service';


const api = new SpecialApprovalTypeControllerApi();

type DeleteSpecialApproval = {
  payload: RequestByIdDtoLong;
  options?: {
    bucketProcessId: string;
    module: string;
    process: string;
  };
}

const useDeleteSpecialApprovalType = ({
  onError = () => {},
  onSuccess = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ payload }: DeleteSpecialApproval) => {
      const res = await api.deleteSpecialApprovalType(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['special-approval-type-list', {
        filter: {
          bucketProcessId: variables.options.bucketProcessId,
          module: variables.options.module,
          process: variables.options.process,
        },
      }]});
      onSuccess();
    },
  });
  return mutation;
};

export default useDeleteSpecialApprovalType;
