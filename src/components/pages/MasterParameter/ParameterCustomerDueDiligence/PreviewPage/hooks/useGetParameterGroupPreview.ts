import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface ParameterGroupPreviewRequest {
  feature?: 'APU_PPT' | 'DATA_UPDATES' | (string & {});
  bucketProcessId?: string | null;
}

const useGetParameterGroupPreview = (payload: ParameterGroupPreviewRequest) => {
  const feature = payload.feature?.trim() || undefined;
  const bucketProcessId = payload.bucketProcessId?.trim() || undefined;

  const query = useQuery({
    enabled: Boolean(payload.feature || payload.bucketProcessId),
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('parameter.parameterGroup.preview', {
        data: { bucketProcessId, feature, module: 'CUSTOMER_DUE_DILIGENCE' },
      });

      return res.data?.data;
    },
    queryKey: ['parameter-group', 'preview', { bucketProcessId, feature, module: 'CUSTOMER_DUE_DILIGENCE' }],
    staleTime: 30_000,
  });

  return query;
};

export default useGetParameterGroupPreview;
