import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useGetDocumentDiscussionAnalystList = (
  payload: any,
  config?: any
) => {
  const query = useQuery<any>({
    enabled: !!payload,
    queryFn: async () => {
      try {
        console.log('Fetching Document Discussion Staff List with payload:', payload);
        const response = await API('mip.mipDiscussion.listDocAnalyst', {
          data: payload,
        });
        console.log('Document Discussion Staff List response:', response);
        return response.data?.data;
      } catch (error) {
        console.error('Error fetching Document Discussion Staff List:', error);
        throw error;
      }
    },
    // biar query ga jalan kalo payload kosong
    queryKey: ['document-discussion-analyst-list', payload],
    ...config,
  });

  return query;
};

export default useGetDocumentDiscussionAnalystList;
