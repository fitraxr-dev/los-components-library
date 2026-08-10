import { useMutation, useQueryClient } from '@tanstack/react-query';

import { RiskProfileControllerApi } from '@/services/openapi/mip-service';

import type { RiskProfileResponseDto, RequestByProcessIdDtoString } from '@/services/openapi/mip-service';


const api = new RiskProfileControllerApi();

const useGetRiskProfileDetail = ({
  onSuccess = (data: RiskProfileResponseDto) => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: RequestByProcessIdDtoString) => {

      const res = await api.getDetailRiskProfile(payload);

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


export default useGetRiskProfileDetail;
