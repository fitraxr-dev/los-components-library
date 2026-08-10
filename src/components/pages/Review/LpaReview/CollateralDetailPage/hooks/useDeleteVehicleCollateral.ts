import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CollateralVehicleControllerApi } from '@/services/openapi/lpa-service';

import type { RequestByCodeAndProcessIdDto } from '@/services/openapi/lpa-service';


const api = new CollateralVehicleControllerApi();

const useDeleteVehicleCollateral = ({
  onSuccess = (data: any) => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: RequestByCodeAndProcessIdDto) => {
      const res = await api.deleteCollateralVehicle(payload);

      return res.data.data.content;
    },
    onError: () => {
      onError();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['collateral-vehicle-detail']});
      queryClient.invalidateQueries({ queryKey: ['collateral-list']});
      queryClient.invalidateQueries({ queryKey: ['vehicle']});
      onSuccess(data.id);
    },
  });

  return mutation;
};

export default useDeleteVehicleCollateral;
