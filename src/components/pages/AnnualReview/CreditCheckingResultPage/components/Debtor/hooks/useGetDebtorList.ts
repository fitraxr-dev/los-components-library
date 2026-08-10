import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


enum DocumentCreationResponseDtoDocumentGroupEnum {
  DIGITALMEMO = 'DIGITAL_MEMO',
  FINANCINGDOCUMENT = 'FINANCING_DOCUMENT',
  SUPPORTINGDOCUMENT = 'SUPPORTING_DOCUMENT'
}

interface PageRequestDto {
  noPage?: number;
  itemPerPage?: number;
}

interface SortRequestDto {
  columnName?: string;
  sortType?: string;
}

interface SearchDetailRequestDto {
  key?: string;
  value?: string;
}

interface RequestByProcessIdDtoString {
  bucketProcessId?: string;
  tableType?: string;
  module?: string;
  process?: string;
}

interface GenericBucketRequestDtoRequestByProcessIdDtoString {
  page?: PageRequestDto;
  sortList?: SortRequestDto;
  searchDetail?: SearchDetailRequestDto;
  filter?: RequestByProcessIdDtoString;
}

interface DocumentCreationResponseDto {
  id?: number;
  documentGroup?: DocumentCreationResponseDtoDocumentGroupEnum;
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

interface ListDebtorResponseDto {
  id?: number;
  bucketProcessId?: string;
  debtorId?: string;
  name?: string;
  npwp?: string;
  type?: string;
  typeLabel?: string;
  jobPosition?: string;
  jobPositionLabel?: string;
  collectability?: string;
  collectabilityLabel?: string;
  resultReporting?: string;
  note?: string;
  googleResult?: string;
  lastCheckedDate?: string;
  completedDate?: string;
  createdDate?: string;
  modifiedDate?: string;
  isSelected?: boolean;
  listDocuments?: Array<DocumentCreationResponseDto>;
}

const useGetDebtorList = (
  payload: GenericBucketRequestDtoRequestByProcessIdDtoString,
  config?: Partial<UseQueryOptions<ListDebtorResponseDto[]>>) => {
  const query = useQuery({
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await API('creditChecking.result.debtor', {
        data: payload,
      });

      return res.data.data.contents;
    },
    queryKey: ['mns-debtor-list', payload],
    ...config,
  });

  return query;
};

export default useGetDebtorList;
