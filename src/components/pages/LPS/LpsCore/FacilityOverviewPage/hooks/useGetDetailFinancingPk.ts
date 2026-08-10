import { useQuery } from '@tanstack/react-query';


import { API } from '@/helpers/api';


const useGetDetailFinancingPk = (payload: any) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await API('agreement.financingFacilityMapping.detail', {
        data: payload,
      });

      return res.data.data.content;
    },
    queryKey: ['financing-detail-pk'],
  });

  return query;
};

export default useGetDetailFinancingPk;
