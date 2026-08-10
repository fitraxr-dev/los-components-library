import { useMutation, useQueryClient } from '@tanstack/react-query';

import { SpecialApprovalTypeControllerApi } from '@/services/openapi/mip-service';

import type { SpecialApprovalTypeRequestDto } from '@/services/openapi/mip-service';


const api = new SpecialApprovalTypeControllerApi();

const useSaveSpecialApproval = ({
  onSuccess = () => {},
  onError = () => {},
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
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
      queryClient.invalidateQueries({ queryKey: ['special-approval', {
        filter: {
          bucketProcessId: variable.bucketProcessId,
          module: variable.module,
          process: variable.process,
          type: variable.type,
        },
      }]});
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveSpecialApproval;
