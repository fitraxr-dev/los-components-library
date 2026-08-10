import { useMutation, useQueryClient } from '@tanstack/react-query';

import { SpecialApprovalTypeControllerApi } from '@/services/openapi/mip-service';

import type { SpecialApprovalTypeRequestDto } from '@/services/openapi/mip-service';


const api = new SpecialApprovalTypeControllerApi();

const useSaveSpecialApprovalType = ({
  onError = () => {},
  onSuccess = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: SpecialApprovalTypeRequestDto) => {

      const res = await api.saveSpecialApprovalType(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['special-approval-type-list', {
        filter: {
          bucketProcessId: variables.bucketProcessId,
          module: variables.module,
          process: variables.process,
        },
      }]});
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveSpecialApprovalType;
