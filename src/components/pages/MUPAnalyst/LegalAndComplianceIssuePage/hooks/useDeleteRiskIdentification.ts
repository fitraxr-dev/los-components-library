import { useMutation, useQueryClient } from '@tanstack/react-query';

import { IdentificationLegalRiskControllerApi } from '@/services/openapi/mip-service';

import type { RequestByIdDtoLong } from '@/services/openapi/mip-service';


type DeleteRiskIdentificationProps = {
  bucketProcessId: string;
  module: string;
  process: string;
  payload: RequestByIdDtoLong;
}

const api = new IdentificationLegalRiskControllerApi();

const useDeleteRiskIdentification = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ payload }: DeleteRiskIdentificationProps) => {
      const res = await api.deleteIdentificationLegalRisk(payload);

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['risk-identification-list', {
        bucketProcessId: variables.bucketProcessId,
        module: variables.module,
        process: variables.process,
      }]});
      queryClient.invalidateQueries({ queryKey: ['risk-identification-detail', { id: variables.payload.id }]});
      onSuccess();
    },

  });
  return mutation;
};

export default useDeleteRiskIdentification;
