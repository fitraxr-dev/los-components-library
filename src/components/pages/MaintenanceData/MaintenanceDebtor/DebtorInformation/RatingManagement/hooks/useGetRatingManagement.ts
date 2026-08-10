import { useQuery } from '@tanstack/react-query';

import { MaintenanceCustomerControllerApi } from '@/services/openapi/master-service';

import type { GenericBucketRequestDtoMaintenanceRatingFilterRequest } from '@/services/openapi/master-service';


const api = new MaintenanceCustomerControllerApi();

const useGetRatingManagement = (payload: GenericBucketRequestDtoMaintenanceRatingFilterRequest) => {
  return useQuery({
    // enabled: !!(payload?.bucketProcessId),
    queryFn: async () => {
      const res = await api.findRatingManagementByDebtor(payload);
      return res?.data;
    },
    queryKey: ['get-rating-management', payload],
  });
};

export default useGetRatingManagement;
