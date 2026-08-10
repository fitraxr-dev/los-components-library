import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useGetParameterEODList = () => {
  const query = useQuery({
    queryFn: async () => {
      const res = await API('parameter.parameterCotEod.eodList', {
        // * Needed for the browser to detect the request as json payload
        // * Setting the headers explicitly doesn't fix the issue for some reason
        data: {},
      });
      return res.data?.data;
    },
    queryKey: ['parameter-eod-list'],
  });
  return query;
};

export default useGetParameterEODList;
