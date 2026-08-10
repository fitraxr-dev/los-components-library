import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { RequestByProcessIdDtoString } from '@/services/openapi/mip-service';


const useGetDetailNotes = (payload: RequestByProcessIdDtoString) => {
  const query = useQuery<any>({
    enabled: payload !== null && payload !== undefined,
    queryFn: async () => {
      try {
        console.log('Calling API with payload:', payload);
        const response = await API('mip.apuppt.getDetailNotes', {
          data: payload,
        });
        console.log('API response:', response);
        return response.data.data.content;
      } catch (error) {
        console.error('API error:', error);
        throw error;
      }
    },
    queryKey: ['notes-detail', payload],
  });

  return query;
};

export default useGetDetailNotes;
