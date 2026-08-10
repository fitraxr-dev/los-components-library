export interface RequestByIdDtoLong {
  id?: number;
}

export interface FinancingFacilityMappingRequestDetailDto {
  financingFacilityId?: number;
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
  module?: string;
  process?: string;
}

export interface GenericBucketRequestDtoRequestByProcessIdDtoString {
  page?: PageRequestDto;
  sortList?: SortRequestDto;
  searchDetail?: SearchDetailRequestDto;
  filter?: RequestByProcessIdDtoString;
}

export interface FinancingFacilityMappingListRequestDto {
  bucketParentId?: string;
}

export interface ListFinancingFacilityResponseDto {
  id?: number;
  orderType?: string;
  orderTypeLabel?: string;
  mappingOrderType?: string;
  mappingOrderTypeLabel?: string;
  financingSegment?: string;
  mappingFinancingSegment?: string;
  financingSegmentLabel?: string;
  facilityId?: string;
  product?: string;
  mappingProduct?: string;
  productLabel?: string;
  orderValue?: string;
  currencyOrderValue?: string;
  exchangeRate?: string;
  currencyExchangeRate?: string;
  orderValueAfterExchangeRate?: string;
  currencyOrderValueAfterExchangeRate?: string;
  timePeriod?: string;
  rates?: number;
  projectName?: string;
  projectId?: number;
  valueProject?: string;
  locationProject?: string;
  locationProjectLabel?: string;
  remark?: string;
  bucketProcessId?: string;
  outstanding?: string;
  collectivity?: string;
  isExisting?: boolean;
  annualReview?: boolean;
  alreadyUpdate?: boolean;
  process?: string;
  module?: string;
  characteristic?: string;
  financingScheme?: string;
  totalOrderValue?: number;
  totalForeignOrderValue?: number;
  plafondDifference?: number;
  isEditable?: boolean;
}

export interface FinancingFacilityMappingResponseDto {
  bucketProcessId?: string;
  bucketParentId?: string;
  financingFacilityId?: number;
  facilityId?: string;
  process?: string;
  module?: string;
  lastPkNumber?: string;
  pkName?: string;
  modifiedDate?: string;
}

export interface GetByDebtorIdRequestDto {
  debtorId?: string;
  bucketProcessId?: string;
  process?: string;
  module?: string;
}

export interface GenericBucketRequestDtoGetByDebtorIdRequestDto {
  page?: PageRequestDto;
  sortList?: SortRequestDto;
  searchDetail?: SearchDetailRequestDto;
  filter?: GetByDebtorIdRequestDto;
}

interface FinancingAttributeDto {
  attributeKey?: string;
  attributeLabel?: string;
  attributeValue?: string;
}

export interface FinancingFacilityRequestDto {
  id?: number;
  debtorId?: string;
  facilityId?: string;
  bucketProcessId?: string;
  module?: string;
  process?: string;
  orderType?: string;
  mappingOrderType?: string;
  financingSegment?: string;
  mappingFinancingSegment?: string;
  product?: string;
  mappingProduct?: string;
  orderValue?: string;
  currencyOrderValue?: string;
  exchangeRate?: string;
  currencyExchangeRate?: string;
  orderValueAfterExchangeRate?: string;
  currencyOrderValueAfterExchangeRate?: string;
  remark?: string;
  collectibility?: string;
  portionPurchasePeriod?: string;
  portionPaymentPeriod?: string;
  form?: string;
  financingObjectives?: string;
  withdrawalPeriod?: string;
  timePeriod?: string;
  gracePeriod?: string;
  profitSharingExpectations?: string;
  providingFacilities?: string;
  rates?: string;
  governmentMandate?: string;
  annualReview?: boolean;
  outstanding?: string;
  currencyOutstanding?: string;
  outstandingIdr?: string;
  projectId?: number;
  characteristic?: string;
  financingScheme?: string;
  attributes?: Array<FinancingAttributeDto>;
}
