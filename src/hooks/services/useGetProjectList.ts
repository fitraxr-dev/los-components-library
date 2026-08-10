import { useQuery } from '@tanstack/react-query';

import useIdentity from '@/hooks/useIdentity';
import { ProjectControllerApi } from '@/services/openapi/master-service';


const api = new ProjectControllerApi();

const useGetProjectList = () => {
  const { debtorId } = useIdentity();
  const query = useQuery({
    placeholderData: [],
    queryFn: async () => {
      const response = await api.getAllProjectByDebtorIdDropList({
        debtorId,
      });

      return response.data.data.contents;
    },
    queryKey: ['projects'],
  });

  return query;
};

export default useGetProjectList;
