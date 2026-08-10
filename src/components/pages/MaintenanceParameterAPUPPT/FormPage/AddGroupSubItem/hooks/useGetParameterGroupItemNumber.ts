import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useGetParameterGroupItemNumber = (payloadNomorItem) => {

  const query = useQuery({
    enabled: true, // Always enable the query
    queryFn: async () => {
      const res = await API('parameter.parameterApuPpt.noItem', {
        data: {
          applicationType: payloadNomorItem.applicationType,
          bucketProcessId: payloadNomorItem.bucketProcessId,
          from: payloadNomorItem.from,
          module: payloadNomorItem.module,
        },
      });

      return res.data?.data;
    },
    queryKey: ['parameter-group', 'lov-number', 'bo', payloadNomorItem.bucketProcessId, payloadNomorItem.from], // Remove applicationType from queryKey
  });

  return query;
};

export default useGetParameterGroupItemNumber;
