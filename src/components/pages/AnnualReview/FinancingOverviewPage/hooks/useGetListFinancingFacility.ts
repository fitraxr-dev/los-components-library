import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useGetListFinancingFacility = (payload: any) => {
  const query = useQuery({
    enabled: Object.values(payload).every((value) => !!value),
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('bucket.financialFacility.list', {
        data: payload,
      });

      return res.data.data;
    },
    queryKey: ['financing-facility-list', payload],
  });

  return query;
};

export default useGetListFinancingFacility;
