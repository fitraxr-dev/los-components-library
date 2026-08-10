import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


export type ParameterCOTEODSummaryRequestDto =
| { id: number; bucketProcessId?: never }
| { bucketProcessId: string; id?: never };

const useGetParameterCOTEODSummary = (payload: ParameterCOTEODSummaryRequestDto) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await API('parameter.parameterCotEod.summary', {
        data: payload,
      });

      return res.data?.data;
    },
    queryKey: ['parameter-cot-eod', 'summary', payload],
  });
  return query;
};

export default useGetParameterCOTEODSummary;
