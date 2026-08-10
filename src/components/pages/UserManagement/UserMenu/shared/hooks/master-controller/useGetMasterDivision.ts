import { useQuery } from '@tanstack/react-query';

import { MasterControllerApi } from '@/services/openapi/user-management-service';

import type { DivisionData } from '@/services/openapi/user-management-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new MasterControllerApi;

const useGetMasterDivision = (
  config?: Partial<UseQueryOptions>
) => {
  const query = useQuery<any>({
    initialData: [],
    queryFn: async () => {

      const res = await api.retrieveAllDivision();
      const data = (res.data.data?.contents as DivisionData[])
        .map((obj) => ({ label: obj.divisionName, value: obj.code }));
      return data;
    },
    queryKey: ['master-division'],
    ...config,
  });

  return query;
};

export default useGetMasterDivision;
