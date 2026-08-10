import { useMutation, useQueryClient } from '@tanstack/react-query';

import { LegalBasisControllerApi } from '@/services/openapi/mip-service';


const api = new LegalBasisControllerApi();

const useSaveLegalBasis = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: purposeDetailDTO) => {
      const res = await api.saveLegalBasis(
        payload.bucketProcessId,
        payload.process,
        payload.module,
        payload.description
      );

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['high-risk-legal-basis-detail', {
        bucketProcessId: variables.bucketProcessId,
        module: variables.module,
        process: variables.process,
      }]});
      onSuccess();
    },
  });
  return mutation;
};

type purposeDetailDTO = {
  bucketProcessId: string;
  process: string;
  module: string;
  description?: any;
}

export default useSaveLegalBasis;
