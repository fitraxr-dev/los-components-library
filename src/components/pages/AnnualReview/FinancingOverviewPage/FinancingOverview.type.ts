export interface RequestByIdDtoLong {
  id?: number;
}

export interface RequestByProcessIdDtoString {
  bucketProcessId?: string;
  module?: string;
  process?: string;
}

export interface PageRequestDto {
  noPage?: number;
  itemPerPage?: number;
}

export interface SortRequestDto {
  columnName?: string;
  sortType?: string;
}

export interface SearchDetailRequestDto {
  key?: string;
  value?: string;
}

export interface FinancingAttributeDto {
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

export interface GenericBucketRequestDtoFinancingFacilityRequestDto {
  page?: PageRequestDto;
  sortList?: SortRequestDto;
  searchDetail?: SearchDetailRequestDto;
  filter?: FinancingFacilityRequestDto;
}
