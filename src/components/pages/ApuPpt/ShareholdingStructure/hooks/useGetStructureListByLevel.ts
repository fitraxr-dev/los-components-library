import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ShareholderStructureControllerApi } from '@/services/openapi/mip-service';

import type { ShareholderStructureByLevelRequestDto } from '@/services/openapi/mip-service';


const api = new ShareholderStructureControllerApi();

const useGetStructureListByLevel = (payload: ShareholderStructureByLevelRequestDto) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getListShareholderStructureByLevel(payload);

      return res.data.data;
    },
    queryKey: ['structure-by-level', payload],
  });

  return query;
};


export default useGetStructureListByLevel;
