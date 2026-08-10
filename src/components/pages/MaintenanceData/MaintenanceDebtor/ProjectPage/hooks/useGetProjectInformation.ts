import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { MaintenanceCustomerControllerApi } from '@/services/openapi/master-service';

import type { GenericBucketRequestDtoMaintenanceProjectFilterRequest } from '@/services/openapi/master-service';


const api = new MaintenanceCustomerControllerApi();

const useGetProjectInformation = (
  payload: GenericBucketRequestDtoMaintenanceProjectFilterRequest,
) => {
  const query = useQuery(
    {
      placeholderData: keepPreviousData,
      queryFn: async () => {
        const res = await api.findProjectByDebtor(payload);
        return res?.data;
      },
      queryKey: [
        'maintenance-project-list',
        payload
      ],
    }
  );

  return query;

};

export default useGetProjectInformation;
