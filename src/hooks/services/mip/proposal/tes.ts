import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { API } from '@/helpers/api';

import type {
  GenericBucketRequestDtoListProposalAttachmentRequestDto,
} from '@/services/openapi/bucket-document-service';


const useGetAttachmentList = (
  payload: GenericBucketRequestDtoListProposalAttachmentRequestDto
) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      try {
        console.log('Fetching Attachment List with payload:', payload);

        const response = await API('bucket.proposal.getAttachmentList', {
          data: payload,
        });

        console.log('Attachment List response:', response);
        return response?.data;
      } catch (error) {
        console.error('Error fetching Attachment List:', error);
        throw error;
      }
    },
    queryKey: [
      'attachment-list',
      {
        filter: {
          bucketProcessId: payload.filter.bucketProcessId,
          documentParent: payload.filter.documentParent,
        },
        page: {
          itemPerPage: payload.page.itemPerPage,
          noPage: payload.page.noPage,
        },
      },
    ],
    select: (data) => data?.data,
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetAttachmentList;
