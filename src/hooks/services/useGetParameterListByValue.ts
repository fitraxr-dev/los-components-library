import { useQuery } from '@tanstack/react-query';

import { ParameterControllerApi } from '@/services/openapi/parameter-service';

import type Modules from '@/enums/Modules';
import type { GetParameterListByValueRequestDto } from '@/services/openapi/parameter-service';
import type { UseQueryOptions } from '@tanstack/react-query';


type DropdownValue = {
  value: string;
  label: string;
  [key: string]: string | number;
}

const api = new ParameterControllerApi();

const useGetParameterListByValue = (payload: GetParameterListByValueRequestDto,
  options: Object = {
    label: 'value1',
    value: 'key',
  },
  config?: Partial<UseQueryOptions<DropdownValue[]>>) => {
  const query = useQuery<any>({
    placeholderData: [],
    queryFn: async () => {
      const response = await api.getListParameterByModuleAndValue(payload);
      const result = response.data.data.listParameter;

      return result.map((data) => {
        const finalObject = {};

        for (const [key, value] of Object.entries(options)) {
          finalObject[key] = data[value];
        }

        return finalObject;
      });
    },
    queryKey: ['parameter-list-by-value', payload],
    ...config,
  });

  return query;
};

export default useGetParameterListByValue;
