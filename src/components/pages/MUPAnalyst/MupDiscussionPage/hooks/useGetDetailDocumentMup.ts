import { useQuery } from '@tanstack/react-query';

import { MipDiscussionControllerApi } from '@/services/openapi/mip-service';

import type { FileUploadRequest, MipDiscussionResponseDto } from '@/services/openapi/mip-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new MipDiscussionControllerApi();


const useGetDetailDocumentMup = (
  payload: Pick<FileUploadRequest, 'uploadId' | 'bucketProcessId'>,
  config?: Partial<UseQueryOptions<MipDiscussionResponseDto>>
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getDocsMipDiscussionByUploadId(payload);

      return res.data.data.content;
    },
    queryKey: ['document', payload],
    ...config,
  });
  return query;
};

export default useGetDetailDocumentMup;
