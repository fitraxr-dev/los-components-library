import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useGetPenerapanCDD = (
  payload: any,
) => {
  const query = useQuery(
    {
      queryFn: async () => {
        const res = await API('master.debtor.penerapanCdd', {
          data: payload,
        });
        return res?.data;
      },
      queryKey: ['get-penerapan-cdd', payload],
    }
  );

  return query;

};

export default useGetPenerapanCDD;
