import { useQuery } from '@tanstack/react-query';


import { MaintenanceCustomerControllerApi } from '@/services/openapi/master-service';

import type { SaveDetailCustomerRequestDto } from '@/services/openapi/master-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new MaintenanceCustomerControllerApi();

const useGetDataDeltaStepper = (
  payload: SaveDetailCustomerRequestDto,
  config?: Partial<UseQueryOptions>
) => {

  const query = useQuery({
    placeholderData: {
      progress: 0,
      steps: [],
    },
    queryFn: async () => {
      const res = await api.dataDeltaStepper(payload);

      return res.data.data.content;
    },
    ...config,
    queryKey: ['data-delta-stepper', payload],
  });

  return query;
};

export default useGetDataDeltaStepper;
