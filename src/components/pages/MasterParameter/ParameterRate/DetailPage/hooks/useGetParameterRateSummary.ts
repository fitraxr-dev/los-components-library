import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


export type ParameterRateSummaryRequestDto =
| { id: number; bucketProcessId?: never }
| { bucketProcessId: string; id?: never };

const useGetParameterRateSummary = (payload: ParameterRateSummaryRequestDto) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await API('parameter.parameterRate.summary', {
        data: payload,
      });

      return res.data?.data;
    },
    queryKey: ['parameter-rate', 'summary', payload],
  });
  return query;
};

export default useGetParameterRateSummary;
