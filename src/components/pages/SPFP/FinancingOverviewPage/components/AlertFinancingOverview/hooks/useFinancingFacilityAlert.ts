import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useGetAlertModified = (payload: any) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('bucket.alertModified.list', {
        data: payload,
      });

      return res.data.data.content;
    },
    queryKey: ['financing-facility-list', payload],
  });

  return query;
};

export default useGetAlertModified;
