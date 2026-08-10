import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { API } from '@/helpers/api';


const useGetDocumentGroup = (payload: any) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      try {
        console.log('Fetching document group with payload:', payload);
        const response = await API('bucketDocument.document.getDocumentGroup', {
          data: payload,
        });
        console.log('Document group response:', response);
        return response.data;
      } catch (error) {
        console.error('Error fetching document group:', error);
        throw error;
      }
    },
    queryKey: ['document-group', payload],
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetDocumentGroup;
