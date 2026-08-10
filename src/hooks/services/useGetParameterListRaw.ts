import { useQuery } from '@tanstack/react-query';

import { ParameterControllerApi } from '@/services/openapi/parameter-service';

import type Modules from '@/enums/Modules';


const api = new ParameterControllerApi();

const useGetParameterListRaw = (module: Modules | string) => {
  const query = useQuery<any>({
    placeholderData: [],
    queryFn: async () => {
      const response = await api.getListParameterByModule({ module });

      return response.data.data.listParameter;
    },
    queryKey: ['parameter-list-raw', { module }],
  });

  return query;
};

export default useGetParameterListRaw;
