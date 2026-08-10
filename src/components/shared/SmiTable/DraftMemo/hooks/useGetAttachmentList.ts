import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { ProposalAttachmentControllerApi } from '@/services/openapi/bucket-document-service';

import type {
  GenericBucketRequestDtoListProposalAttachmentRequestDto,
} from '@/services/openapi/bucket-document-service';


const api = new ProposalAttachmentControllerApi();

const useGetAttachmentList = (payload: GenericBucketRequestDtoListProposalAttachmentRequestDto) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getListProposalAttachment(payload);

      return res.data;
    },
    queryKey: ['attachment-list', {
      filter: {
        bucketProcessId: payload.filter.bucketProcessId,
        documentParent: payload.filter.documentParent,
      },
      page: {
        itemPerPage: payload.page.itemPerPage,
        noPage: payload.page.noPage,
      },
    }],
    select: (data) => data.data,
  });

  return query;
};

export default useGetAttachmentList;
