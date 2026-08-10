import { useMutation, useQueryClient } from '@tanstack/react-query';

import { IdentificationLegalRiskControllerApi } from '@/services/openapi/mip-service';

import type { IdentificationLegalRiskResponseDto, RequestByProcessIdDtoString } from '@/services/openapi/mip-service';


const api = new IdentificationLegalRiskControllerApi();

const useIdentifyRisksDetail = ({
  onSuccess = (data: IdentificationLegalRiskResponseDto) => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: RequestByProcessIdDtoString) => {

      const res = await api.getDetailIdentificationLegalRisk(payload);

      return res?.data?.data?.content;
    },
    onError: () => {
      onError();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['identify-legal-risks-detail']});
      onSuccess(data);
    },
  });

  return mutation;
};


export default useIdentifyRisksDetail;
