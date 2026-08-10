import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


interface ShareholderDetailRequest {
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

interface ShareholderDetailResponse {
  id?: number;
  debtorId?: string;
  bucketProcessId?: string;
  shareholderCode?: string;
  type?: string;
  typeLabel?: string;
  name?: string;
  npwp?: string;
  nik?: string;
  shares?: string;
  valuePerShare?: string;
  curValuePerShare?: string;
  value?: string;
  percentage?: number;
  jobPosition?: string;
  jobPositionLabel?: string;
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
  identityNo?: string;
  identityTypeLabel?: string;
  identityDocument?: ListDocument[];
}

const useGetShareholderDetail = (payload: ShareholderDetailRequest, queryConfig?: Partial<UseQueryOptions>) => {
  const query = useQuery<ShareholderDetailResponse>({
    enabled: !!(payload.summaryId && payload.referenceCode && payload.bucketProcessId),
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('creditChecking.detail.shareholder', { data: payload });

      return res.data?.data?.content;
    },
    ...queryConfig,
    queryKey: ['credit-checking', 'shareholder', 'detail', payload],
  });
  return query;
};

export default useGetShareholderDetail;
