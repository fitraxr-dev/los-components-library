import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type Modules from '@/enums/Modules';
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

const useGetParameterList = (
  module: Modules | string,
  options: ParameterOptions = {
    label: 'value1',
    value: 'key',
  },
  config?: Partial<UseQueryOptions<DropdownValue[]>>
) => {
  const query = useQuery<any>({
    enabled: !!module,
    placeholderData: [],
    queryFn: async () => {
      try {
        console.log('Calling API with module:', module);

        const response = await API('parameter.parameter.getListByModule', {
          data: { module },
        });

        const result = response.data.data.listParameter;

        return result.map((data: any) => {
          const finalObject: any = {};

          for (const [key, value] of Object.entries(options)) {
            finalObject[key] = data[value];
          }

          return finalObject;
        });
      } catch (error) {
        console.error('API error:', error);
        throw error;
      }
    },
    queryKey: ['parameter-list-v2', { module }],
    ...config,
  });

  return query;
};

export default useGetParameterList;
