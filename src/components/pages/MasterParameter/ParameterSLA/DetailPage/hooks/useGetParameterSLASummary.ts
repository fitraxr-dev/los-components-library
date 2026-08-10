import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


export type ParameterSLASummaryRequestDto =
  | { module: string; bucketProcessId?: never }
  | { bucketProcessId: string; module?: never };

const useGetParameterSLASummary = (payload: ParameterSLASummaryRequestDto) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await API('parameter.parameterSla.summary', {
        data: payload,
      });

      return res.data?.data;
    },
    queryKey: ['parameter-sla-summary', payload],
  });
  return query;
};

export default useGetParameterSLASummary;
