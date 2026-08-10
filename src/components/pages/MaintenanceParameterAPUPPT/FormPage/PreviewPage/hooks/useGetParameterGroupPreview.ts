import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface ParameterGroupPreviewRequest {
  feature?: 'APU_PPT' | 'DATA_UPDATES' | (string & {});
  bucketProcessId?: string | null;
  id?: string | null;
}

const useGetParameterGroupPreview = (payload: ParameterGroupPreviewRequest) => {
  const feature = payload.feature?.trim() || undefined;
  const bucketProcessId = payload.bucketProcessId?.trim() || undefined;

  const query = useQuery({
    enabled: Boolean(payload.feature || payload.bucketProcessId || payload.id),
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('parameter.parameterApuPpt.preview', {
        data: { bucketProcessId, feature, id: payload.id, module: 'APU_PPT' },
      });

      return res.data?.data;
    },
    queryKey: ['parameter-group', 'preview', { bucketProcessId, feature, module: 'APU_PPT' }],
    staleTime: 30_000,
  });

  return query;
};

export default useGetParameterGroupPreview;
