import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface UseGetParamComponentSyariahProps {
  id: number | string;
  enabled?: boolean;
}

interface ParamComponentSyariahResponse {
  id?: number;
  productCode?: string;
  productCodeReference?: string;
  attributes?: Array<{
    attributeKey?: string;
    attributeLabel?: string;
    attributeType?: string;
    attributeFields?: string[];
    attributeValue?: string;
  }>;
}

const useGetParamComponentSyariah = (
  props: UseGetParamComponentSyariahProps
) => {
  const { id, enabled = true } = props;

  return useQuery<ParamComponentSyariahResponse>({
    enabled: enabled && !!id,
    queryFn: async () => {
      try {
        // Ensure ID is sent as number
        const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
        const response = await API('parameter.parameterSkemaSyariah.getParamComponentSyariah', {
          data: { id: numericId },
        });
        return response.data.data;
      } catch (error) {
        throw error;
      }
    },
    queryKey: ['param-component-syariah', id],
  });
};

export default useGetParamComponentSyariah;
