import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ShareholderStructureControllerApi } from '@/services/openapi/mip-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/mip-service';


const api = new ShareholderStructureControllerApi();

const useGetGroupedList = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getListGroupedShareholderStructure(payload);

      return res.data.data;
    },
    queryKey: ['apuppt-grouped-list', payload],
  });

  return query;
};


export default useGetGroupedList;
