import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { ProposalControllerApi } from '@/services/openapi/mip-service';

import type { GenericBucketRequestDtoProposalAttachmentList } from '@/services/openapi/mip-service';


const api = new ProposalControllerApi();

const useGetAttachmentList = (payload: GenericBucketRequestDtoProposalAttachmentList) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getProposalAttachment(payload);

      return res.data;
    },
    queryKey: ['attachment-list', {
      filter: {
        bucketProcessId: payload.filter.bucketProcessId,
        documentGroup: payload.filter.documentGroup,
      },
      page: {
        itemPerPage: payload.page.itemPerPage,
        noPage: payload.page.noPage,
      },
    }],
    select: (data) => data.data,
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetAttachmentList;
