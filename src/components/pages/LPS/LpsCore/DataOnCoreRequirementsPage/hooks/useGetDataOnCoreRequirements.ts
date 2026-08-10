import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface PayloadInterface {
  bucketProcessId: string;
  module: string;
  process: string;
}

const useGetDataOnCoreRequirements = (payload: PayloadInterface) => {
  const query = useQuery({
    enabled: payload.bucketProcessId !== null && payload.bucketProcessId !== undefined,
    queryFn: async () => {
      const res = await API('master.lps.dataOnCoreRequirements', {
        data: payload,
      });

      return res.data.data.content;
    },
    queryKey: ['data-on-core-requirements'],
    refetchInterval: 5000,
  });

  return query;
};

export default useGetDataOnCoreRequirements;
