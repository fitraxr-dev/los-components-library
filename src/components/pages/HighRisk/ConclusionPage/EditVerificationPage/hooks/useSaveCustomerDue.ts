import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CustomerDueDiligenceControllerApi } from '@/services/openapi/mip-service';


const api = new CustomerDueDiligenceControllerApi();


type SaveCustDuePayload = {
  id: number;
  bucketProcessId: string;
  process: string;
  module: string;
  document: string;
  debtorId?: string;
  assessmentSummary?: boolean;
  verificationSummary?: boolean;
  isDkCheck?: boolean;
  confirmationResult?: any;
  assessmentResult?: any;
  verificationResult?: any;
}


const useSaveBeneficialOwner = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({

    mutationFn: async (props: SaveCustDuePayload) => {
      const {
        id,
        bucketProcessId,
        process,
        module,
        document,
        debtorId,
        assessmentSummary,
        verificationSummary,
        isDkCheck,
        confirmationResult,
        verificationResult,
        assessmentResult,
      } = props;

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

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customer-due-diligence-list', {
        bucketProcessId: variables.bucketProcessId,
        module: variables.module,
        process: variables.process,
      }]});
      queryClient.invalidateQueries({ queryKey: ['customer-due-diligence', { id: variables.id }]});
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveBeneficialOwner;
