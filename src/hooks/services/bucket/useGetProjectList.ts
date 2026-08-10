import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useGetProjectList = (payload: any) => {
  const query = useQuery<any>({
    placeholderData: [],
    queryFn: async () => {
      try {
        console.log('Calling API with payload:', payload);
        const response = await API('bucket.project.autocomplete', {
          data: payload,
        });
        console.log('API response:', response);
        return response.data.data.contents;
      } catch (error) {
        console.error('API error:', error);
        throw error;
      }
    },
    queryKey: ['projects-financing-facility', payload],
  });

  return query;
};

export default useGetProjectList;
