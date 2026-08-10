import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { MaintenanceCustomerControllerApi } from '@/services/openapi/master-service';

import type { GenericBucketRequestDtoListDebtorRequestDto } from '@/services/openapi/master-service';


const api = new MaintenanceCustomerControllerApi();

const useGetBucketMaintenanceCustomer = (payload: GenericBucketRequestDtoListDebtorRequestDto) => {
  const res = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getCustomerMaintenance(payload);

      return res.data.data;
    },
    queryKey: ['bucket-maintenance-customer', payload],
  });

  return res;
};

export default useGetBucketMaintenanceCustomer;
