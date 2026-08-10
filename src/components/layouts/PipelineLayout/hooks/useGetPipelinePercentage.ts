import { useQuery } from '@tanstack/react-query';

import { TypeModule, TypeProcess } from '@/enums/Module';
import { BucketControllerApi } from '@/services/openapi/bucket-service';


const api = new BucketControllerApi();

const useGetPipelinePercentage = (processId: string) => {
  const query = useQuery({
    enabled: processId !== undefined &&
    processId !== null &&
    processId !== '',
    queryFn: async () => {
      const res = await api.getBucketDetail({
        bucketProcessId: processId,
        module: TypeModule.PIPELINE,
        process: TypeProcess.PIPELINE,
      });

      return res.data.data.content.process;
    },
    queryKey: ['pipeline-percentage', { bucketProcessId: processId }],
  });

  return query;
};

export default useGetPipelinePercentage;
