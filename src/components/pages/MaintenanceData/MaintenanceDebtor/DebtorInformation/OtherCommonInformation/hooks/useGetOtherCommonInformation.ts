import { useQuery } from '@tanstack/react-query';

import { MaintenanceCustomerControllerApi } from '@/services/openapi/master-service';

import type { DetailCustomerRequestDto } from '@/services/openapi/master-service';


const api = new MaintenanceCustomerControllerApi();

const useGetOtherCommonInformation = (payload: DetailCustomerRequestDto) => {
  return useQuery({
    // enabled: !!(payload?.bucketProcessId),
    queryFn: async () => {
      const res = await api.getDetailCustomerMaintenanceOtherCommonInformation(payload);
      return res?.data;
    },
    queryKey: ['get-other-common-information', payload],
  });
};

export default useGetOtherCommonInformation;
