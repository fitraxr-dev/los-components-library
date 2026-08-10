import { useQuery } from '@tanstack/react-query';

import { ParameterControllerApi } from '@/services/openapi/parameter-service';

import type Modules from '@/enums/Modules';


type DropdownValue = {
  value: string;
  label: string;
}

const api = new ParameterControllerApi();

const useGetParameterListByModule = (listModule: Modules[], options: DropdownValue = {
  label: 'value1',
  value: 'key',
}) => {
  const query = useQuery({
    placeholderData: [],
    queryFn: async () => {
      const response = await api.getListParameterByListModule({ listModule });
      const result = response.data.data.listParameter;

      return result.map((data) => ({
        label: String(data[options.label]),
        value: String(data[options.value]),
      }));
    },
    queryKey: ['parameter-list-by-module', { listModule }],
  });

  return query;
};

export default useGetParameterListByModule;
