import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { CollateralMachinesEquipmentControllerApi } from '@/services/openapi/lpa-service';

import type { CollateralMachinesEquipmentResponseDto, RequestByIdDtoString } from '@/services/openapi/lpa-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new CollateralMachinesEquipmentControllerApi() ;

const useGetMachineEquipmentDetailCollateral = (
  payload: RequestByIdDtoString,
  config?: Partial<UseQueryOptions<CollateralMachinesEquipmentResponseDto>>
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.detailCollateralMachinesEquipment(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['collateral-machine-equipment-detail', payload],
    ...config,
  });

  return query;
};


export default useGetMachineEquipmentDetailCollateral;
