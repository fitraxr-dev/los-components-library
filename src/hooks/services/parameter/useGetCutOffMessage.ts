import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useGetCutOffMessage = () => {
  const query = useQuery({
    queryFn: async () => {
      try {
        const response = await API('parameter.parameter.getCutOff');
        console.log('Detail API response get cut off:', response);
        return response.data.data;
      } catch (error) {
        console.error('API error:', error);
        throw error;
      }
    },
    queryKey: ['parameter-get-cut-off'],
  });

  return query;
};

export default useGetCutOffMessage;
