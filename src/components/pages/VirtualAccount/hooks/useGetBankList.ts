import { useQuery } from '@tanstack/react-query';

import { ParamVaControllerApi } from '@/services/openapi/parameter-service';

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

const api = new ParamVaControllerApi();

const useGetBankList = (options: ParameterOptions = {
  label: 'key',
  value: 'key',
}, config?: Partial<UseQueryOptions<DropdownValue[]>>) => {
  const query = useQuery<any>({
    placeholderData: [],
    queryFn: async () => {
      const response = await api.getBankParams();
      const result = response.data.data.listParameter;

      return result.map((data) => {
        const finalObject = {};

        for (const [key, value] of Object.entries(options)) {
          finalObject[key] = data[value];
        }

        return finalObject;
      });
    },
    queryKey: ['bank-list-va'],
    ...config,
  });

  return query;
};

export default useGetBankList;
