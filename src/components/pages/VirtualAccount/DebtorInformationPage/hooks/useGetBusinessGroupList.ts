import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { ApplicationDebtorControllerApi } from '@/services/openapi/bucket-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/bucket-service';


const api = new ApplicationDebtorControllerApi();

const useGetBusinessGroupList = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getListDebtorGroup(payload);

      return res;
    },
    queryKey: ['site-visit-business-group-list'],
    select: (response) => response.data.data,
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetBusinessGroupList;
