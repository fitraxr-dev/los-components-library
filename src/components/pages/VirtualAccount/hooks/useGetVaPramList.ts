import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


type DropdownValue = {
  value: string;
  label: string;
  [key: string]: string | number;
}

type ParameterOptions = {
  label?: string;
  value?: string;
  [key: string]: string | number;
}

type GetVaParamsRequestDto = {
  key?: string;
  module?: string;
  bankName?: string;
  currency?: string;
  vaType?: string;
}

const useGetVaPramList = (payload: GetVaParamsRequestDto, options: ParameterOptions = {
  label: 'key',
  value: 'key',
}, config?: Partial<UseQueryOptions<DropdownValue[]>>) => {
  const query = useQuery<any>({
    placeholderData: [],
    queryFn: async () => {
      const response = await API('parameter.paramVa.getVaParams', { data: payload });
      const result = response.data.data.listParameter;

      return result.map((data) => {
        const finalObject = {};

        for (const [key, value] of Object.entries(options)) {
          finalObject[key] = data[value];
        }

        return finalObject;
      });
    },
    queryKey: ['param-list-va', payload],
    ...config,
  });

  return query;
};

export default useGetVaPramList;
