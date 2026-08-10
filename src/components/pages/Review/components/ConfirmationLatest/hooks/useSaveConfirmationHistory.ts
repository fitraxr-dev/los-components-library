import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ConfirmationHistoryControllerApi } from '@/services/openapi/mip-service';

import type { ConfirmationHistoryRequestDto } from '@/services/openapi/mip-service';


type SaveBeneficialOwnerProps = {
  id: number;
  bucketProcessId: string;
  process: string;
  module: string;
  document: string;
  isBusinessCheck?: boolean;
  isDpopCheck?: boolean;
  isDkCheck: boolean;
  isCopy?: boolean;
  status?: string;
  confirmationResult: any;
  assessmentResult: any;
  verificationResult: any;
  debtorId: string;
  isPreviousData?: boolean;
}

const api = new ConfirmationHistoryControllerApi();

const useSaveConfirmationHistory = ({
  onError = () => { },
  onSuccess = () => { },
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: ConfirmationHistoryRequestDto) => {
      const res = await api.saveConfirmation(payload);
      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['confirmation-history-latests']});
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveConfirmationHistory;
