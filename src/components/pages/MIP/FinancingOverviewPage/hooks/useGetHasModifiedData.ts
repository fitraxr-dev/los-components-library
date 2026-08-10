import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface HasModifiedPayload {
  bucketProcessId: string;
  module: string;
  process: string;
}

const useGetHasModifiedData = (
  payload: HasModifiedPayload,
  config?: Partial<UseQueryOptions<boolean>>
) => {
  const query = useQuery<boolean>({
    enabled: Object.values(payload).every((value) => !!value),
    queryFn: async () => {
      const res = await API('bucket.alertModified.list', {
        data: payload,
      });

      return res.data.data.content;
    },
    queryKey: ['has-modified', payload],
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
    ...config,
  });

  return query;
};

export default useGetHasModifiedData;
