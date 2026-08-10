import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useGetDifferentData = (
  payload: any,
) => {
  const query = useQuery(
    {
      placeholderData: keepPreviousData,
      queryFn: async () => {
        try {
          const res = await API('mip.differentData.confirmationHistory', { data: payload });
          return res?.data;
        } catch (err) {
          console.error('API ERROR:', err);
          throw err;
        }
      },
      queryKey: [
        'different-data',
        payload
      ],
      refetchInterval: 5000,
    }
  );

  return query;

};

export default useGetDifferentData;
