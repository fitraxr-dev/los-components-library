import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CollateralMachinesEquipmentControllerApi } from '@/services/openapi/lpa-service';

import type { RequestByCodeAndProcessIdDto } from '@/services/openapi/lpa-service';


const api = new CollateralMachinesEquipmentControllerApi();

const useDeleteMachineEquipmentCollateral = ({
  onSuccess = (data: any) => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: RequestByCodeAndProcessIdDto) => {
      const res = await api.deleteCollateralMachinesEquipment(payload);

      return res.data.data.content;
    },
    onError: () => {
      onError();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['collateral-machine-equipment-detail']});
      queryClient.invalidateQueries({ queryKey: ['collateral-list']});
      queryClient.invalidateQueries({ queryKey: ['machine']});
      onSuccess(data.id);
    },
  });

  return mutation;
};

export default useDeleteMachineEquipmentCollateral;
