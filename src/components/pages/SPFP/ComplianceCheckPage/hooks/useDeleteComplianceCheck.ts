import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ComplianceCheckControllerApi } from '@/services/openapi/agreement-service';

import type { ComplianceRequestDto } from '@/services/openapi/agreement-service';


const api = new ComplianceCheckControllerApi();

const useSaveComplianceCheck = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: ComplianceRequestDto) => {
      const res = await api.deleteComplianceCheck(payload);
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


export default useSaveComplianceCheck;
