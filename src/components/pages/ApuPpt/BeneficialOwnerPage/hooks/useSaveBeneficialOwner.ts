import { useMutation, useQueryClient } from '@tanstack/react-query';

import { BeneficialOwnerControllerApi } from '@/services/openapi/mip-service';


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

const api = new BeneficialOwnerControllerApi();

const useSaveBeneficialOwner = ({
  onError = () => { },
  onSuccess = () => { },
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: SaveBeneficialOwnerProps) => {
      const {
        id,
        bucketProcessId,
        process,
        module,
        document,
        isBusinessCheck,
        isDpopCheck,
        isDkCheck,
        isCopy,
        status,
        confirmationResult,
        verificationResult,
        assessmentResult,
        debtorId,
        isPreviousData,
      } = payload;


      const res = await api.saveBeneficialOwner(
        id,
        bucketProcessId,
        process,
        module,
        debtorId,
        document,
        isBusinessCheck,
        isDpopCheck,
        isDkCheck,
        isCopy,
        status,
        isPreviousData,
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
      queryClient.invalidateQueries({ queryKey: ['beneficial-owner', variables]});
      queryClient.invalidateQueries({ queryKey: ['beneficial-owners-child', variables]});
      queryClient.invalidateQueries({ queryKey: ['beneficial-owners', variables]});
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveBeneficialOwner;
