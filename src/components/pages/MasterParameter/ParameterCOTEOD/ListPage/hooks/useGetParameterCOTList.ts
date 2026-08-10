import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useGetParameterCOTList = () => {
  const query = useQuery({
    queryFn: async () => {
      const res = await API('parameter.parameterCotEod.cotList', {
        // * Needed for the browser to detect the request as json payload
        // * Setting the headers explicitly doesn't fix the issue for some reason
        data: {},
      });
      return res.data?.data;
    },
    queryKey: ['parameter-cot-list'],
  });
  return query;
};

export default useGetParameterCOTList;
