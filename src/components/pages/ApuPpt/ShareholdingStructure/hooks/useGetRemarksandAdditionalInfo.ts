import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { ShareholderStructureControllerApi } from '@/services/openapi/mip-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/mip-service';


const api = new ShareholderStructureControllerApi();

const useGetRemarksAndAdditional = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getShareholderStructureRemark(payload);

      return res;
    },
    queryKey: ['apuppt-shareholding-structure-remark', payload],
    select: (response) => response.data.data,
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetRemarksAndAdditional;
