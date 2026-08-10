import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


interface OtherRelationDetailRequest {
  summaryId?: number;
  referenceCode: string;
  bucketProcessId: string;
}

interface ListDocument {
  id?: number;
  documentGroup?: string;
  documentType?: string;
  documentTypeLabel?: string;
  documentExtension?: string;
  document?: string;
  documentName?: string;
  documentNumber?: string;
  documentDate?: string;
  bucketProcessId?: string;
  ownership?: string;
  ownerId?: string;
  createdDate?: string;
  createdBy?: string;
  createdAt?: string;
  fileName?: string;
  modifiedDate?: string;
  modifiedBy?: string;
  debtorId?: string;
  hasSubmitted?: boolean;
}

interface OtherRelationDetailResponse {
  id?: number;
  bucketProcessId?: string;
  otherRelatedCode?: string;
  debtorId?: string;
  type?: string;
  typeLabel?: string;
  typeDescription?: string;
  jobPosition?: string;
  jobPositionLabel?: string;
  name?: string;
  npwp?: string;
  nik?: string;
  npwpDocId?: number;
  nikDocId?: number;
  collectability?: string;
  collectabilityLabel?: string;
  resultReporting?: string;
  note?: string;
  googleResult?: string;
  ref?: string;
  lastCheckedDate?: string;
  completedDate?: string;
  createdDate?: string;
  modifiedDate?: string;
  listDocuments?: ListDocument[];
  identityTypeLabel?: string;
  identityNo?: string;
  modifiedBy?: string;
}

const useGetOtherRelationDetail = (payload: OtherRelationDetailRequest, queryConfig?: Partial<UseQueryOptions>) => {
  const query = useQuery<OtherRelationDetailResponse>({
    enabled: !!(payload.summaryId && payload.referenceCode && payload.bucketProcessId),
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('fastTrack.detail.otherRelated', { data: payload });

      return res.data?.data?.content;
    },
    ...queryConfig,
    queryKey: ['fast-track', 'other-related', 'detail', payload],
  });
  return query;
};

export default useGetOtherRelationDetail;
