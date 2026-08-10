import { useMutation, useQueryClient } from '@tanstack/react-query';

import { RiskProfileControllerApi } from '@/services/openapi/mip-service';

import type { RequestByIdDtoLong } from '@/services/openapi/mip-service';


const api = new RiskProfileControllerApi();

const useRiskProfileDelete = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: RequestByIdDtoLong) => {
      const res = await api.deleteRiskProfile(payload);
      return res.data.data.content;
    },
    onError: () => {
      onError();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['risk-profile-delete']});
      onSuccess();
    },
  });

  return mutation;
};

export default useRiskProfileDelete;
