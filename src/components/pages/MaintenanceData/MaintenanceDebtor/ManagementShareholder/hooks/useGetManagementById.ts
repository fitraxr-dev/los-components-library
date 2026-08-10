import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { MaintenanceManagementControllerApi, ManagementControllerApi } from '@/services/openapi/master-service';

import type { DetailManagementRequestDto } from '@/services/openapi/master-service';


const master = new MaintenanceManagementControllerApi();

const useGetManagement = (payload: DetailManagementRequestDto) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await master.getDetailCustomerMaintenanceManagement(payload);

      return res?.data?.data?.content;
    },
    queryKey: ['management-detail', payload],
  },
  );

  return query;
};


export default useGetManagement;
