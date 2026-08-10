import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ComplianceCheckControllerApi, ProcessingControllerApi } from '@/services/openapi/agreement-service';

import type { ComplianceRequestDto, ProcessingRequestDto } from '@/services/openapi/agreement-service';


const api = new ProcessingControllerApi();

const useSubmitComplianceCheck = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: ProcessingRequestDto) => {
      const res = await api.submitSPFP(payload);
      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ['get-detail-compliance-check']});
      onSuccess();
    },
  });

  return mutation;
};


export default useSubmitComplianceCheck;
