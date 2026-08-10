import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BeneficialOwnerControllerApi } from '@/services/openapi/mip-service';

import type { BeneficialOwnerRemarkRequestDto } from '@/services/openapi/mip-service';


const api = new BeneficialOwnerControllerApi();

const useSaveBeneficialOwnerRemark = ({
  onError = () => {},
  onSuccess = () => {},
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: BeneficialOwnerRemarkRequestDto) => {
      const res = await api.saveRemarkBeneficialOwner(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['beneficial-owner-remark', {
        bucketProcessId: variables.bucketProcessId,
        module: variables.module,
        process: variables.process,
      }]});
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper', {
        bucketProcessId: variables.bucketProcessId,
        module: variables.module,
        process: variables.process,
      }]});
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveBeneficialOwnerRemark;
