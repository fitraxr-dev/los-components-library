import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CollateralBuildingControllerApi, CollateralControllerApi } from '@/services/openapi/lpa-service';

import type { RequestByCodeAndProcessIdDto } from '@/services/openapi/lpa-service';


const api = new CollateralBuildingControllerApi();

const useDeleteBuildingCollateral = ({
  onSuccess = (data: any) => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: RequestByCodeAndProcessIdDto) => {
      const res = await api.deleteCollateralBuilding(payload);

      return res.data.data.content;
    },
    onError: () => {
      onError();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['collateral-building-detail']});
      queryClient.invalidateQueries({ queryKey: ['collateral-list']});
      queryClient.invalidateQueries({ queryKey: ['building']});
      onSuccess(data.id);
    },
  });

  return mutation;
};

export default useDeleteBuildingCollateral;
