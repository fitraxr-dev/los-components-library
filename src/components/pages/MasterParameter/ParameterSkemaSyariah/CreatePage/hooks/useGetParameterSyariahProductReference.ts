import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


export interface ParameterSyariahProductReference {
  id?: number;
  key: string;
  value1: string;
  value2?: string;
}

export interface ParameterSyariahProductReferenceResponse {
  listParameter: ParameterSyariahProductReference[];
}

const useGetParameterSyariahProductReference = (
  config?: Partial<UseQueryOptions<ParameterSyariahProductReferenceResponse>>
) => {
  const query = useQuery({
    queryFn: async () => {
      const response = await API('parameter.parameterSkemaSyariah.getParamProductReference', {
        data: {},
      });

      return response.data.data;
    },
    queryKey: ['parameter-syariah-product-reference'],
    ...config,
  });

  return query;
};

export default useGetParameterSyariahProductReference;
