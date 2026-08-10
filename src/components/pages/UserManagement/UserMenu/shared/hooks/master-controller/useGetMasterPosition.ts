import { useQuery } from '@tanstack/react-query';

import { MasterControllerApi } from '@/services/openapi/user-management-service';

import type { PositionData } from '@/services/openapi/user-management-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new MasterControllerApi;

const useGetMasterPosition = (
  config?: Partial<UseQueryOptions>
) => {
  const query = useQuery<any>({
    initialData: [],
    queryFn: async () => {

      const res = await api.retrieveAllPosition();
      const data = (res.data.data?.contents as PositionData[])
        .map((obj) => ({ label: obj.positionName, value: obj.code }));
      return data;
    },
    queryKey: ['master-position'],
    ...config,
  });

  return query;
};

export default useGetMasterPosition;
