import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ProjectV2ControllerApi } from '@/services/openapi/master-service';

import type { GenericBucketRequestDtoMaintenanceProjectFilterRequest } from '@/services/openapi/master-service';


const api = new ProjectV2ControllerApi();

const useGetMaintenanceProyekData = (
  payload: GenericBucketRequestDtoMaintenanceProjectFilterRequest,
) => {
  const query = useQuery(
    {
      placeholderData: keepPreviousData,
      queryFn: async () => {
        const res = await api.getAllMaintenanceProject(payload);
        return res?.data;
      },
      queryKey: [
        'maintenance-proyek-list',
        payload
      ],
    }
  );

  return query;

};

export default useGetMaintenanceProyekData;
