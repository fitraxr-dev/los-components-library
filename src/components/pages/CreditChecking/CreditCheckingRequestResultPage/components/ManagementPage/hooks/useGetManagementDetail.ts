import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


interface ManagementDetailRequest {
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

interface ManagementDetailResponse {
  id?: number;
  debtorId?: string;
  bucketProcessId?: string;
  managementCode?: string;
  name?: string;
  npwp?: string;
  nik?: string;
  type?: string;
  typeLabel?: string;
  jobPosition?: string;
  jobPositionLabel?: string;
  collectability?: string;
  collectabilityLabel?: string;
  resultReporting?: string;
  note?: string;
  googleResult?: string;
  ref?: string;
  dob?: string;
  lastCheckedDate?: string;
  completedDate?: string;
  createdDate?: string;
  modifiedDate?: string;
  listDocuments?: ListDocument[];
}

const useGetManagementDetail = (payload: ManagementDetailRequest, queryConfig?: Partial<UseQueryOptions>) => {
  const query = useQuery<ManagementDetailResponse>({
    enabled: !!(payload.summaryId && payload.referenceCode && payload.bucketProcessId),
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('creditChecking.detail.management', { data: payload });

      return res.data?.data?.content;
    },
    ...queryConfig,
    queryKey: ['credit-checking', 'management', 'detail', payload],
  });
  return query;
};

export default useGetManagementDetail;
