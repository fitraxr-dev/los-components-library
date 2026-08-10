import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import { SummaryControllerApi } from '@/services/openapi/credit-checking-service';

import type {
  GenericBucketRequestDtoListSummaryAttachmentRequestDto,
} from '@/services/openapi/credit-checking-service';


const api = new SummaryControllerApi();

const useGetListSummaryAttachment = (payload: GenericBucketRequestDtoListSummaryAttachmentRequestDto) => {

  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await api.getListSummaryAttachment({
        filter: {
          bucketProcessId: payload.filter.bucketProcessId,
          documentGroup: payload.filter.documentGroup,
        },
        page: {
          itemPerPage: payload.page.itemPerPage,
          noPage: payload.page.noPage,
        },
      });

      return res.data;
    },
    queryKey: ['list-summary-attachment', {
      bucketProcessId: payload.filter.bucketProcessId,
      documentGroup: payload.filter.documentGroup,
      itemPerPage: payload.page.itemPerPage,
    }],
    select: (data) => data.data,
    staleTime: ONE_MINUTE,
  });

  return query;
};

export default useGetListSummaryAttachment;
