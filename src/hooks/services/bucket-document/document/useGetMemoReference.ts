import { useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


const useGetMemoReference = (
  payload: any,
  config?: Partial<UseQueryOptions<any>>
) => {
  const query = useQuery<any>({
    enabled: Object.values(payload || {}).every((value) => !!value),
    queryFn: async () => {
      try {
        console.log('Calling API (bucket-document) with payload:', payload);
        const response = await API('bucketDocument.document.ownedDigitalMemo', {
          data: payload,
        });
        console.log('API response (bucket-document):', response);
        return response?.data?.data?.content;
      } catch (error) {
        console.error('API error (bucket-document):', error);
        throw error;
      }
    },
    queryKey: ['mup-memo-reference', payload],
    refetchOnMount: 'always',
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

export default useGetMemoReference;
