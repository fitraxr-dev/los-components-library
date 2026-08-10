import { useQuery } from '@tanstack/react-query';

import { ParameterControllerApi } from '@/services/openapi/parameter-service';

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

const api = new ParameterControllerApi();

const useGetParameterListVa = (module: Modules | string, options: ParameterOptions = {
  label: 'value1',
  value: 'value2',
}, config?: Partial<UseQueryOptions<DropdownValue[]>>) => {
  const query = useQuery<any>({
    placeholderData: [],
    queryFn: async () => {
      const response = await api.getListParameterByModule({ module });
      const result = response.data.data.listParameter;

      return result.map((data) => {
        const finalObject = {};

        for (const [key, value] of Object.entries(options)) {
          finalObject[key] = data[value];
        }

        return finalObject;
      });
    },
    queryKey: ['parameter-list-va', { module }],
    ...config,
  });

  return query;
};

export default useGetParameterListVa;
