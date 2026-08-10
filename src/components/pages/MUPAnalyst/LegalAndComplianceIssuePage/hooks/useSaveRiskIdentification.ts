import { useMutation, useQueryClient } from '@tanstack/react-query';

import { IdentificationLegalRiskControllerApi } from '@/services/openapi/mip-service';


type SaveRiskIdentificationProps = {
  id?: number;
  bucketProcessId: string;
  process: string;
  module: string;
  legalRiskType?: string;
  businessResponse?: Blob;
}

const api = new IdentificationLegalRiskControllerApi();

const useSaveRiskIdentification = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      bucketProcessId,
      process,
      module,
      id,
      legalRiskType,
      businessResponse,
    }: SaveRiskIdentificationProps) => {
      const res = await api.saveIdentificationLegalRiskBusinessResponse(
        bucketProcessId,
        process,
        module,
        id,
        legalRiskType,
        businessResponse
      );

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables) => {
      onSuccess();
      queryClient.invalidateQueries({ queryKey: ['risk-identification-list', {
        bucketProcessId: variables.bucketProcessId,
        module: variables.module,
        process: variables.process,
      }]});
      queryClient.invalidateQueries({ queryKey: ['risk-identification-detail', { id: variables.id }]});
    },
  });
  return mutation;
};

export default useSaveRiskIdentification;
