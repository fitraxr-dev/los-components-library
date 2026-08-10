import { useQueries } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const PARAM_KEYS = [
  'info000001',
  'info000002',
  'info000003',
  'info000004',
  'info000005',
  'info000006',
] as const;

type ParamKey = typeof PARAM_KEYS[number];

interface ParamByKeyResponse {
  info000001?: any;
  info000002?: any;
  info000003?: any;
  info000004?: any;
  info000005?: any;
  info000006?: any;
}

const useGetParamByKey = () => {
  const queries = useQueries({
    combine: (results) => {
      const data: ParamByKeyResponse = {};

      results.forEach((result, index) => {
        const key = PARAM_KEYS[index] as ParamKey;
        data[key] = result.data;
      });

      const isLoading = results.some((r) => r.isLoading);
      const isPending = results.some((r) => r.isPending);
      const isError = results.some((r) => r.isError);
      const error = results.find((r) => r.isError)?.error ?? null;

      const refetchAll = async () => {
        await Promise.all(results.map((r) => r.refetch()));
      };

      return {
        data,
        error,
        isError,
        isLoading,
        isPending,
        refetchAll,
      };
    },
    queries: PARAM_KEYS.map((key) => ({
      queryFn: async () => {
        try {
          const response = await API('parameter.parameterBmpp.paramByKey', {
            data: { key },
          });
          return response?.data?.data?.content;
        } catch (error) {
          console.error(`API error for key ${key}:`, error);
          throw error;
        }
      },
      queryKey: ['parameter-by-key', key],
    })),
  });

  return queries;
};

export default useGetParamByKey;
