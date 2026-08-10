import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface SubItemDetailParams {
  id: number | null;
  bucketProcessId: string | null;
}

const useGetParameterGroupSubItemDetail = (params: SubItemDetailParams) => {
  const query = useQuery({
    enabled: !!(params?.id),
    queryFn: async () => {
      const res = await API('parameter.parameterApuPpt.subItemDetail', {
        data: {
          bucketProcessId: params.bucketProcessId,
          id: params.id,
        },
      });

      return res.data?.data?.content;
    },
    queryKey: ['parameter-apu-ppt-sub-item-detail', params.id, params.bucketProcessId],
  });

  return query;
};

export default useGetParameterGroupSubItemDetail;
