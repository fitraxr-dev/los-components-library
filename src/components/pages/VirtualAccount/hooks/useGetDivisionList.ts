import { useQuery } from '@tanstack/react-query';

import { MasterV2ControllerApi } from '@/services/openapi/user-management-service';

import type Modules from '@/enums/Modules';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new MasterV2ControllerApi();

const useGetDivisionList = () => {
  const query = useQuery({
    placeholderData: [],
    queryFn: async () => {
      const response = await api.retrieveDivisionShortMaster();
      const result = response.data.data.contents;

      return response.data.data.contents;
    },
    queryKey: ['division-list-va'],
  });
  return query;
};

export default useGetDivisionList;
