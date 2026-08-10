import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useGetParameterGroupItemNumber = (applicationType, module, bucketProcessId, from: 'item' | 'subitem' | '' = '', id: string = '') => {

  const query = useQuery({
    enabled: false, // Disable automatic fetching
    queryFn: async () => {
      const res = await API('parameter.parameterApuPpt.noItem', {
        data: {
          applicationType,
          bucketProcessId: bucketProcessId === 'null' ? null : bucketProcessId,
          from,
          ...(id ? { id } : {}),
          module: module,
        },
      });

      return res.data?.data;
    },
    queryKey: ['parameter-group', 'lov-number', 'bo', module, from, id],
  });

  return query;
};

export default useGetParameterGroupItemNumber;
