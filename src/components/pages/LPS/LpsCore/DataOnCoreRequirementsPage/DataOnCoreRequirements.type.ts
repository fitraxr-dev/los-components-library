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

interface GetByDebtorIdRequestDto {
  debtorId?: string;
  bucketProcessId?: string;
  process?: string;
  module?: string;
}

interface ListMManagementRequestDto {
  bucketProcessId?: string;
  debtorId?: string;
  managementCode?: string;
  startLastCheckedDate?: string;
  endLastCheckedDate?: string;
  personInCharge?: boolean;
  jobPosition?: Array<string>;
}

interface GenericRequestDto {
  page?: PageRequestDto;
  sortList?: SortRequestDto;
  searchDetail?: SearchDetailRequestDto;
}

enum DocumentCreationResponseDtoDocumentGroupEnum {
  DIGITALMEMO = 'DIGITAL_MEMO',
  FINANCINGDOCUMENT = 'FINANCING_DOCUMENT',
  SUPPORTINGDOCUMENT = 'SUPPORTING_DOCUMENT',
  COUNTERPARTYINFORMATION = 'COUNTERPARTY_INFORMATION'
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


export interface GenericBucketRequestDtoGetByDebtorIdRequestDto extends GenericRequestDto {
  filter?: GetByDebtorIdRequestDto;
}

export interface GenericBucketRequestDtoListMManagementRequestDto extends GenericRequestDto {
  filter?: ListMManagementRequestDto;
}

export interface RequestByIdDtoLong {
  id?: number;
}

export interface DetailShareholderRequestDto {
  bucketProcessId?: string;
  debtorId?: string;
  shareholderId?: string;
  module?: string;
  process?: string;
}

export interface DetailManagementRequestDto {
  debtorId?: string;
  bucketProcessId?: string;
  module?: string;
  process?: string;
  managementCode?: string;
}

export interface DetailShareholderResponseDto {
  debtorId?: string;
  bucketProcessId?: string;
  shareholderId?: string;
  refId?: string;
  institutionType?: string;
  institutionTypeLabel?: string;
  name?: string;
  prefix?: string;
  suffix?: string;
  informationSource?: string;
  level?: number;
  beneficialOwner?: string;
  jobPosition?: string;
  jobPositionLabel?: string;
  idType?: string;
  idNo?: string;
  idDocument?: DocumentCreationResponseDto;
  identityExpiry?: string;
  npwp?: string;
  npwpDocument?: DocumentCreationResponseDto;
  stockSheet?: string;
  value?: string;
  currencyValue?: string;
  exchangeRate?: string;
  totalValue?: string;
  percentage?: string;
  nominal?: string;
  status?: string;
  isDeleted?: boolean;
  modifiedBy?: string;
  modifiedDate?: string;
  establishmentAct?: string;
  establishmentActFile?: DocumentCreationResponseDto;
  lastChangeAct?: string;
  lastChangeActFile?: DocumentCreationResponseDto;
}
