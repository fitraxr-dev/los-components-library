import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { API } from '@/helpers/api';


const useGetMemoSupplementById = (payload: any) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      try {
        console.log('Fetching Memo Supplement with payload:', payload);

        const response = await API('mip.memoSupplement.getDetail', {
          data: payload,
        });

        console.log('Memo Supplement response:', response);
        return response?.data?.data?.content;
      } catch (error) {
        console.error('Error fetching Memo Supplement:', error);
        throw error;
      }
    },
    queryKey: ['memo-supplement', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetMemoSupplementById;
