import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CollateralBoatControllerApi, CollateralControllerApi } from '@/services/openapi/lpa-service';

import type { RequestByCodeAndProcessIdDto } from '@/services/openapi/lpa-service';


const api = new CollateralBoatControllerApi();

const useDeleteBoatCollateral = ({
  onSuccess = (data: any) => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: RequestByCodeAndProcessIdDto) => {
      const res = await api.deleteCollateralBoat(payload);

      return res.data.data.content;
    },
    onError: () => {
      onError();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['collateral-boat-detail']});
      queryClient.invalidateQueries({ queryKey: ['collateral-list']});
      queryClient.invalidateQueries({ queryKey: ['boat']});
      onSuccess(data.id);
    },
  });

  return mutation;
};

export default useDeleteBoatCollateral;
