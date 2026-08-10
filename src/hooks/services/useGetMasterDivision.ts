import { useQuery } from '@tanstack/react-query';

import { MasterControllerApi } from '@/services/openapi/user-management-service';


const api = new MasterControllerApi();

const useGetMasterDivision = () => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.division();

      return res.data.data.contents;
    },
    queryKey: ['um-master-divisions'],
  });

  return query;
};

export default useGetMasterDivision;
