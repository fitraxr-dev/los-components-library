import { useQuery } from '@tanstack/react-query';

import { MipDiscussionControllerApi } from '@/services/openapi/mip-service';

import type { FileUploadRequest, MipDiscussionResponseDto } from '@/services/openapi/mip-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new MipDiscussionControllerApi();

const useGetConfirmAnalyst = (
  payload: Pick<FileUploadRequest, 'bucketProcessId' | 'bucketMasterId'>,
  config?: Partial<UseQueryOptions<MipDiscussionResponseDto>>
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.checkConfirmMipDiscussionByAnalyst(payload);

      return res.data.data.content;
    },
    queryKey: ['confirm-analyst'],
    ...config,
  });

  return query;
};

export default useGetConfirmAnalyst;
