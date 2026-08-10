import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { RequestByIdDtoLong } from '../FacilityOverview.type';


const useGetDetailFinancingFacility = (payload: RequestByIdDtoLong) => {
  const query = useQuery({
    enabled: payload.id !== null && payload.id !== undefined,
    queryFn: async () => {
      const res = await API('bucket.financialFacility.detail', {
        data: payload,
      });

      return res.data.data.content;
    },
    queryKey: ['financing-facility-detail'],
  });

  return query;
};

export default useGetDetailFinancingFacility;
