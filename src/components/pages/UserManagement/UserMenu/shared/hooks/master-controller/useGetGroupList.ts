import { useQuery } from '@tanstack/react-query';

import { MasterControllerApi } from '@/services/openapi/user-management-service';

import type { GeneralLabel } from '@/services/openapi/user-management-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new MasterControllerApi;

const useGetGroupList = (
  config?: Partial<UseQueryOptions>
) => {
  const query = useQuery<any>({
    initialData: [],
    queryFn: async () => {

      const res = await api.retrieveAllGroup();

      const data = (res.data.data?.contents as GeneralLabel[])
        .map((obj) => ({ label: obj.label, value: obj.key }));
      return data;
    },
    queryKey: ['group-list'],
    ...config,
  });

  return query;
};

export default useGetGroupList;
