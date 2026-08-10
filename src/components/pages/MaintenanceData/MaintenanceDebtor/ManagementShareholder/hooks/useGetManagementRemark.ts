import { useQuery } from '@tanstack/react-query';

import { ManagementControllerApi } from '@/services/openapi/master-service';

import type { DebtorRequest } from '@/services/openapi/master-service';


const api = new ManagementControllerApi();

const useGetManagementRemark = (payload: DebtorRequest) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.retrieveDescription(payload);
      const managementData = res.data.data.content;

      return managementData;
    },
    queryKey: ['management-description', payload],
  });

  return query;
};

export default useGetManagementRemark;
