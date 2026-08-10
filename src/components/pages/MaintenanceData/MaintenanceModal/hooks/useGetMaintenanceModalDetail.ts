import { useQuery } from '@tanstack/react-query';

import { MaintenanceCapitalControllerApi } from '@/services/openapi/master-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/master-service';


const api = new MaintenanceCapitalControllerApi();

const useGetMaintenanceModalDetail = (
  payload?: RequestByProcessIdDtoString,
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.bucketDetailCapital(payload);

      return res.data.data.content;
    },
    queryKey: ['get-capital-approval-detail', payload],
  });

  return query;
};

export default useGetMaintenanceModalDetail;
