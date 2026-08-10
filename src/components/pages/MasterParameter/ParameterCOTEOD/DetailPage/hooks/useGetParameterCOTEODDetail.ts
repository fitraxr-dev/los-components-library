import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


export interface ParameterCOTEODFilterDetailRequest {
  id?: number;
  menuCode?: string;
}

const useGetParameterCOTEODDetail = (kind: 'COT' | 'EOD', payload: ParameterCOTEODFilterDetailRequest) => {
  const query = useQuery({
    queryFn: async () => {
      const endpoint = kind === 'COT' ? 'parameter.parameterCotEod.cotDetail' : 'parameter.parameterCotEod.eodDetail';
      const res = await API(endpoint, {
        data: payload,
      });

      return res.data?.data;
    },
    queryKey: [`parameter-${kind.toLowerCase()}`, 'detail', payload],
  });
  return query;
};

export default useGetParameterCOTEODDetail;
