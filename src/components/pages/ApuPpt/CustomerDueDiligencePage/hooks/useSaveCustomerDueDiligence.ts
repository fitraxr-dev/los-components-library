import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CustomerDueDiligenceControllerApi } from '@/services/openapi/mip-service';


type SaveCustomerDueDiligenceProps = {
  id: number;
  bucketProcessId: string;
  process: string;
  module: string;
  document: string;
  isDkCheck?: boolean;
  confirmationResult?: any;
  assessmentSummary: boolean;
  assessmentResult: any;
  verificationSummary?: boolean;
  verificationResult?: any;
  debtorId: string;
}

const api = new CustomerDueDiligenceControllerApi();

const useSaveCustomerDueDiligence = ({
  onError = () => {},
  onSuccess = () => {},
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: SaveCustomerDueDiligenceProps) => {
      const {
        id,
        bucketProcessId,
        process,
        module,
        document,
        assessmentSummary,
        verificationSummary,
        isDkCheck,
        confirmationResult,
        verificationResult,
        assessmentResult,
        debtorId,
      } = payload;

      const res = await api.saveCustomerDueDiligence(
        id,
        bucketProcessId,
        process,
        module,
        document,
        debtorId,
        assessmentSummary,
        verificationSummary,
        isDkCheck,
        assessmentResult,
        verificationResult,
        confirmationResult,
      );

      return res.data.data.content;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customer-due-diligence-list-child']});
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper']});
      queryClient.invalidateQueries({ queryKey: ['customer-due-diligence', variables]});
      queryClient.invalidateQueries({ queryKey: ['customer-due-diligence-list', variables]});
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveCustomerDueDiligence;
