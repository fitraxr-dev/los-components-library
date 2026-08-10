import { useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


interface RefinaDetailPayload {
  requestDetailSubmissionId: number;
}

interface RefinaDetailContent {
  productName: string;
  productDescription: string;
  productStatus: string;
  projectName: string;
  projectDescription: string;
  projectLocationName: string;
  projectAddress: string;
}

interface RefinaDetailResponse {
  content: RefinaDetailContent;
}

const useGetRefinaDetail = (
  payload: RefinaDetailPayload,
  config?: Partial<UseQueryOptions<RefinaDetailResponse>>
) => {
  const query = useQuery({
    enabled: !!payload.requestDetailSubmissionId,
    queryFn: async () => {
      const res = await API('pipeline.refina.getListSubmissionDetail', {
        data: payload,
      });
      return res.data.data;
    },
    queryKey: [
      'refina-detail',
      payload
    ],
    ...config,
  });

  return query;
};

export default useGetRefinaDetail;
