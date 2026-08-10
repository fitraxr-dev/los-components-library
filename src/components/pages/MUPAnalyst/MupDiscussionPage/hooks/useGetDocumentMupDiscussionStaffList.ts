import { useQuery } from '@tanstack/react-query';

import { MipDiscussionControllerApi } from '@/services/openapi/mip-service';

import type {
  GenericBucketRequestDtoMapStringString,
  GenericBucketResponseDtoMipDiscussionResponseDto,
} from '@/services/openapi/mip-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const api = new MipDiscussionControllerApi();

const useGetDocumentMupDiscussionStaffList = (
  payload: GenericBucketRequestDtoMapStringString,
  config?: Partial<UseQueryOptions<GenericBucketResponseDtoMipDiscussionResponseDto>>
) => {
  const query = useQuery({
    queryFn: async () => {
      const res = await api.listDocsMipDiscussionStaff(payload);

      return res.data.data;
    },

    queryKey: ['document-mup-discussion-staff-list', payload],
    ...config,
  });
  return query;
};

export default useGetDocumentMupDiscussionStaffList;
