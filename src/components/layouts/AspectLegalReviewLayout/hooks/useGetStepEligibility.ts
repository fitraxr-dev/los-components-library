import { keepPreviousData, useQuery } from '@tanstack/react-query';


import { ProcessorControllerApi } from '@/services/openapi/processor-service';

import type { RequestByProcessIdDtoString } from '@/services/openapi/processor-service';


const api = new ProcessorControllerApi();

const useGetStepMip = (bucketProcessId: RequestByProcessIdDtoString) => {
  const query = useQuery({
    enabled: bucketProcessId !== undefined && bucketProcessId !== null,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.stepperBucket(bucketProcessId);

      return res.data.data.content;
    },
    queryKey: ['step', { bucketProcessId }],
  });

  return query;
};

export default useGetStepMip;
