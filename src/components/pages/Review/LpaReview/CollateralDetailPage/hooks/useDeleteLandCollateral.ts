import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CollateralLandControllerApi } from '@/services/openapi/lpa-service';

import type { RequestByCodeAndProcessIdDto } from '@/services/openapi/lpa-service';


const api = new CollateralLandControllerApi();

const useDeleteLandCollateral = ({
  onSuccess = (data: any) => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: RequestByCodeAndProcessIdDto) => {
      const res = await api.deleteCollateralLand(payload);

      return res.data.data.content;
    },
    onError: () => {
      onError();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['collateral-land-detail']});
      queryClient.invalidateQueries({ queryKey: ['collateral-list']});
      queryClient.invalidateQueries({ queryKey: ['land']});
      onSuccess(data.id);
    },
  });

  return mutation;
};

export default useDeleteLandCollateral;
