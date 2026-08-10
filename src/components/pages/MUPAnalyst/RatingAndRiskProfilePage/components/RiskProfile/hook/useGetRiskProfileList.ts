import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { RiskProfileControllerApi } from '@/services/openapi/mip-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/mip-service';


const api = new RiskProfileControllerApi();


const useGetRiskProfileList = (
  payload: RequestByProcessIdDtoString,
) => {
  const query = useQuery(
    {
      placeholderData: keepPreviousData,
      queryFn: async () => {
        const res = await api.getListRiskProfile(payload);
        return res.data.data;
      },
      queryKey: [
        'risk-profile-list',
        payload
      ],
    }
  );

  return query;
};


export default useGetRiskProfileList;
