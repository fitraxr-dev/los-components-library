import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { API } from '@/helpers/api';


interface CheckSubmitPayload {
  bucketMasterId: string;
  process: string;
}

const useCheckSubmit = (
  payload: CheckSubmitPayload,
  options?: Partial<UseQueryOptions<boolean, unknown, boolean>>,
) => {
  const { enabled, ...restOptions } = options ?? {};
  const shouldEnableQuery =
    !!payload?.bucketMasterId &&
    !!payload?.process &&
    (enabled ?? true);

  const query = useQuery<boolean, unknown, boolean>({
    enabled: shouldEnableQuery,
    queryFn: async () => {
      const response = await API('bucket.bucket.checkSubmit', {
        data: payload,
      });

      return Boolean(response?.data?.data?.content);
    },
    queryKey: ['bucket-check-submit', payload],
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
    staleTime: ONE_MINUTE,
    ...restOptions,
  });

  return query;
};

export default useCheckSubmit;
