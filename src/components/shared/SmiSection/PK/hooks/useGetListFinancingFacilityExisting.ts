import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useGetListFinancingFacilityExisting = (payload: any) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await API('bucket.financialFacility.existLos', {
        data: payload,
      });

      return res.data.data;
    },
    queryKey: ['financing-facility-all-existing', payload],
  });

  return query;
};

export default useGetListFinancingFacilityExisting;
