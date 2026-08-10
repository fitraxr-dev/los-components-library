import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CustomerDueDiligenceControllerApi } from '@/services/openapi/mip-service';

import type { CustomerDueDiligenceRemarkRequestDto } from '@/services/openapi/mip-service';


const api = new CustomerDueDiligenceControllerApi();

const useSaveCustomerDueDiligenceRemark = ({
  onError = () => {},
  onSuccess = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: CustomerDueDiligenceRemarkRequestDto) => {
      const res = await api.saveRemarkCustomerDueDiligence(payload);

      return res.data.data.content;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper', {
        bucketProcessId: variables.bucketProcessId,
        module: variables.module,
        process: variables.process,
      }]});
      queryClient.invalidateQueries({ queryKey: ['customer-due-diligence-remark', {
        bucketProcessId: variables.bucketProcessId,
        module: variables.module,
        process: variables.process,
      }]});
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveCustomerDueDiligenceRemark;
