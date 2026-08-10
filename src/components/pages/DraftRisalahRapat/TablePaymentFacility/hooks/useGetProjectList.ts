import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useGetProjectList = (payload: any) => {
  const query = useQuery({
    placeholderData: [],
    queryFn: async () => {
      try {
        const response = await API('bucket.project.autocomplete', { data: payload });
        return response.data.data.contents || [];
      } catch (error) {
        console.error('Error fetching project list:', error);
        return [];
      }
    },
    queryKey: ['projects-financing-facility', payload],
  });

  return query;
};

export default useGetProjectList;
