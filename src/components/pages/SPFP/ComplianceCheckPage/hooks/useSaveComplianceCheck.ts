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
    mutationFn: async ({
      bucketProcessId,
      comment,
      complianceNumber,
      complianceParent,
      complianceTitle,
      description,
      disclaimer,
      isComply,
      isOpen,
      module,
      note,
      process,
    }: ComplianceRequestDto) => {
      const res = await api.saveComplianceCheck(
        bucketProcessId,
        module,
        process,
        isComply,
        description,
        disclaimer,
        complianceTitle,
        complianceParent,
        complianceNumber,
        isOpen,
        comment,
        note
      );
      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variable) => {
      queryClient.invalidateQueries({ queryKey: ['get-detail-compliance-check']});
      queryClient.invalidateQueries({ queryKey: ['get-detail-compliance-check-child']});
      onSuccess();
    },
  });

  return mutation;
};


export default useSaveComplianceCheck;
