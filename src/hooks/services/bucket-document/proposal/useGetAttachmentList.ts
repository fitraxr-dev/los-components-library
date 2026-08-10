import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { API } from '@/helpers/api';


const useGetAttachmentList = (payload: any) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      try {
        console.log('Fetching attachment list with payload:', payload);
        const response = await API('bucketDocument.proposal.getListAttachment', {
          data: payload,
        });
        console.log('Attachment list response:', response);
        return response.data;
      } catch (error) {
        console.error('Error fetching attachment list:', error);
        throw error;
      }
    },
    queryKey: ['attachment-list', payload],
    select: (data) => data.data,
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetAttachmentList;
