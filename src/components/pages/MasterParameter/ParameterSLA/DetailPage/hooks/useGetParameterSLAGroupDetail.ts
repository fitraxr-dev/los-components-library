import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


export interface ParameterSLAFilterGroupRequest {
  bucketProcessId?: string;
  module?: string;
  process?: string;
}

const useGetParameterSLAGroupDetail = (payload: ParameterSLAFilterGroupRequest) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await API('parameter.parameterSla.groupDetail', {
        data: payload,
      });

      return res.data?.data;
    },
    queryKey: ['parameter-sla-group-detail', payload],
  });
  return query;
};

export default useGetParameterSLAGroupDetail;
