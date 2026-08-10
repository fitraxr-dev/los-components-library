import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


export interface ParameterSyariahProduct {
  key: string;
  value1: string;
  value2?: string;
}

export interface ParameterSyariahProductsResponse {
  listParameter: ParameterSyariahProduct[];
}

const useGetParameterSyariahProducts = (
  config?: Partial<UseQueryOptions<ParameterSyariahProductsResponse>>
) => {
  const query = useQuery({
    queryFn: async () => {
      const response = await API('parameter.parameterSkemaSyariah.getParamProduct', {
        data: {},
      });

      return response.data.data;
    },
    queryKey: ['parameter-syariah-products'],
    ...config,
  });

  return query;
};

export default useGetParameterSyariahProducts;
