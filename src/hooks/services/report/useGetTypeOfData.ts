import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


const useGetTypeOfData = (
  payload: any = {},
  config?: Partial<UseQueryOptions<any>>
) => {
  const finalPayload = {
    bucketProcessId: '',
    key: '',
    module: 'typeLogInterface',
    ...payload,
  };

  return useQuery({
    enabled: true,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      try {
        console.log('Calling API with payload:', finalPayload);

        const response = await API('parameter.parameterData.typeOfData', {
          data: finalPayload,
        });

        console.log('API response:', response);
        return response.data.data;
      } catch (error) {
        console.error('API error:', error);
        throw error;
      }
    },
    queryKey: ['type-of-data', finalPayload],
    ...config,
  });
};

export default useGetTypeOfData;
