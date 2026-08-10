import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useGetParameterGroupLovCode = (applicationType) => {
  const query = useQuery({
    enabled: !!applicationType,
    queryFn: async () => {
      const res = await API('parameter.parameterGroup.lovCode', {
        data: {
          applicationType,
          from: 'item',
          module: 'DOCUMENT_VERIFICATION',
        },
      });

      return res.data?.data;
    },
    queryKey: ['parameter-group', 'lov-code', applicationType],
  });

  return query;
};

export default useGetParameterGroupLovCode;
