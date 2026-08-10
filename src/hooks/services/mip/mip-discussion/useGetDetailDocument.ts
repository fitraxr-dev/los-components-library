import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


const useGetDetailDocument = (
  payload: any,
  config?: Partial<UseQueryOptions<any>>
) => {
  const query = useQuery({
    queryFn: async () => {
      try {
        console.log('Fetching Discussion document detail with payload:', payload);
        const response = await API('mip.mipDiscussion.detailDocsStaff', {
          data: payload,
        });
        console.log('Discussion document detail response:', response);
        return response.data?.data?.content;
      } catch (error) {
        console.error('Error fetching Discussion document detail:', error);
        throw error;
      }
    },
    queryKey: ['document', payload],
    ...config,
  });

  return query;
};

export default useGetDetailDocument;
