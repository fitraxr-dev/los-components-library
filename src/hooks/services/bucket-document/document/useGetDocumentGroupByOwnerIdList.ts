import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useGetDocumentGroupByOwnerIdList = (
  payload: any,
  config?: any
) => {
  const query = useQuery({
    enabled: !!payload,
    queryFn: async () => {
      try {
        console.log('Get Document Group By OwnerId List with payload:', payload);
        const response = await API('bucketDocument.document.getDocumentByOwnerId', {
          data: payload,
        });
        console.log('API response:', response);
        return response.data?.data;
      } catch (error) {
        console.error('API error:', error);
        throw error;
      }
    },

    queryKey: ['documents', payload],
    ...config,
  });

  return query;
};

export default useGetDocumentGroupByOwnerIdList;
