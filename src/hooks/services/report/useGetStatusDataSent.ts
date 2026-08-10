import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


const useGetStatusDataSent = (
  payload: any = {},
  config?: Partial<UseQueryOptions<any>>
) => {
  const finalPayload = {
    bucketProcessId: '',
    key: '',
    module: 'statusLogInterface',
    ...payload,
  };

  return useQuery({
    enabled: true,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      try {
        console.log('Calling API with payload:', finalPayload);

        const response = await API('parameter.parameterData.statusDataSent', {
          data: finalPayload,
        });

        console.log('API response:', response);
        return response.data.data;
      } catch (error) {
        console.error('API error:', error);
        throw error;
      }
    },
    queryKey: ['status-data-sent', finalPayload],
    ...config,
  });
};

export default useGetStatusDataSent;
