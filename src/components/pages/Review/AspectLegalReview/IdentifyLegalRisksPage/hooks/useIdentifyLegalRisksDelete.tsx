import { useMutation, useQueryClient } from '@tanstack/react-query';

import { IdentificationLegalRiskControllerApi } from '@/services/openapi/mip-service';

import type { RequestByIdDtoLong } from '@/services/openapi/mip-service';


const api = new IdentificationLegalRiskControllerApi();

const useIdentifyLegalRisksDelete = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: RequestByIdDtoLong) => {

      const res = await api.deleteIdentificationLegalRisk(payload);

      return res.data.data.content;
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['identify-legal-risks-delete']});
      onSuccess();
    },
  });

  return mutation;
};

export default useIdentifyLegalRisksDelete;
