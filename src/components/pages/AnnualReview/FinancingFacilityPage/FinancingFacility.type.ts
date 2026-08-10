export interface RequestByIdDtoLong {
  id?: number;
}

export interface ProjectDto {
  id?: number;
  name?: string;
  value?: string;
  curValue?: string;
  sector?: string;
  sectorLabel?: string;
  district?: string;
  districtLabel?: string;
  city?: string;
  cityLabel?: string;
  province?: string;
  provinceLabel?: string;
  curExchangeRate?: string;
  exchangeRate?: string;
  curValueInIdr?: string;
  valueInIdr?: string;
  debtorId?: string;
  projectCode?: string;
  createdDate?: string;
  createdBy?: number;
  modifiedDate?: string;
  modifiedBy?: number;
  isEditable?: boolean;
}

export interface FinancingAttributeDto {
  attributeKey?: string;
  attributeLabel?: string;
  attributeValue?: string;
}

export interface FinancingFacilityResponseDto {
  id?: number;
  debtorId?: string;
  debtorName?: string;
  facilityId?: string;
  orderType?: string;
  orderTypeLabel?: string;
  mappingOrderType?: string;
  mappingOrderTypeLabel?: string;
  financingSegment?: string;
  financingSegmentLabel?: string;
  mappingFinancingSegment?: string;
  product?: string;
  productLabel?: string;
  mappingProduct?: string;
  orderValue?: string;
  currencyOrderValue?: string;
  exchangeRate?: string;
  currencyExchangeRate?: string;
  orderValueAfterExchangeRate?: string;
  currencyOrderValueAfterExchangeRate?: string;
  remark?: string;
  bucketProcessId?: string;
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
  governmentMandateLabel?: string;
  annualReview?: boolean;
  outstanding?: string;
  currencyOutstanding?: string;
  outstandingIdr?: string;
  hasModified?: boolean;
  project?: ProjectDto;
  isExisting?: boolean;
  collectability?: string;
  collectabilityLabel?: string;
  process?: string;
  module?: string;
  isEditable?: boolean;
  characteristic?: string;
  modifiedDate?: string;
  totalOrderValue?: number;
  totalForeignOrderValue?: number;
  plafondDifference?: number;
  financingScheme?: string;
  attributes?: Array<FinancingAttributeDto>;
}

export interface FinancingFacilityAnnualReviewResponseDto {
  id?: number;
  facilityId?: string;
  orderType?: string;
  orderTypeLabel?: string;
  financingSegment?: string;
  financingSegmentLabel?: string;
  product?: string;
  productLabel?: string;
  orderValue?: string;
  currencyOrderValue?: string;
  exchangeRate?: string;
  currencyExchangeRate?: string;
  orderValueAfterExchangeRate?: string;
  currencyOrderValueAfterExchangeRate?: string;
  remark?: string;
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
  governmentMandateLabel?: string;
  annualReview?: boolean;
  outstanding?: string;
  currencyOutstanding?: string;
  outstandingIdr?: string;
  hasModified?: boolean;
  project?: ProjectDto;
  isExisting?: boolean;
  collectability?: string;
  collectabilityLabel?: string;
}

export interface GenericSingleDtoFinancingFacilityAnnualReviewResponseDto {
  content?: FinancingFacilityAnnualReviewResponseDto;
}

export interface BaseResponseGenericSingleDtoFinancingFacilityAnnualReviewResponseDto {
  operationId?: string;
  errorCode?: string;
  errorDesc?: string;
  errorSource?: string;
  errorDetail?: string;
  timestamp?: string;
  data?: GenericSingleDtoFinancingFacilityAnnualReviewResponseDto;
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

export interface RequestByProcessIdDtoString {
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

export interface ListFinancingFacilityAnnualReviewResponseDto {
  id?: number;
  facilityId?: string;
  financingSegmentLabel?: string;
  productLabel?: string;
  orderValueAfterExchangeRate?: string;
  currencyOrderValueAfterExchangeRate?: string;
  outstanding?: string;
  currencyOutstanding?: string;
  rates?: string;
  annualReview?: boolean;
  disableAnnualReview?: boolean;
  collectabilityLabel?: string;
  dataPer?: string;
}

export interface PageResponseDto {
  noPage?: number;
  itemPerPage?: number;
  totalPage?: number;
  totalData?: number;
}

export interface GenericBucketResponseDtoListFinancingFacilityAnnualReviewResponseDto {
  contents?: Array<ListFinancingFacilityAnnualReviewResponseDto>;
  page?: PageResponseDto;
}

interface GenericResponse {
  operationId?: string;
  errorCode?: string;
  errorDesc?: string;
  errorSource?: string;
  errorDetail?: string;
  timestamp?: string;
}

export interface BaseResponseGenericBucketResponseDtoListFinancingFacilityAnnualReviewResponseDto
  extends GenericResponse {
  data?: GenericBucketResponseDtoListFinancingFacilityAnnualReviewResponseDto;
}

export interface FinancingFacilityMipResponseDto {
  bucketProcessId?: string;
  process?: string;
  module?: string;
  remarkExisting?: string;
  remarkOtherBank?: string;
}

export interface GenericSingleDtoFinancingFacilityMipResponseDto {
  content?: FinancingFacilityMipResponseDto;
}

export interface BaseResponseGenericSingleDtoFinancingFacilityMipResponseDto extends GenericResponse {
  data?: GenericSingleDtoFinancingFacilityMipResponseDto;
}

export interface FacilityOtherBankResponseDto {
  bank?: string;
  bankType?: string;
  bankTypeLabel?: string;
  bankLabel?: string;
}

export interface FinancingFacilityOtherBankResponseDto {
  id?: number;
  bucketProcessId?: string;
  process?: string;
  module?: string;
  debtorName?: string;
  product?: string;
  outstanding?: string;
  currencyOutstanding?: string;
  outstandingIdr?: string;
  rates?: string;
  collectability?: string;
  collectabilityLabel?: string;
  bankType?: string;
  bankTypeLabel?: string;
  bank?: string;
  bankLabel?: string;
  plafond?: string;
  currencyPlafond?: string;
  plafondIdr?: string;
  exchangeRate?: string;
  currencyExchangeRate?: string;
  remark?: string;
  callType?: string;
  isSyndication?: boolean;
  otherBankList?: Array<FacilityOtherBankResponseDto>;
}

export interface GenericSingleDtoFinancingFacilityOtherBankResponseDto {
  content?: FinancingFacilityOtherBankResponseDto;
}

export interface BaseResponseGenericSingleDtoFinancingFacilityOtherBankResponseDto
  extends GenericResponse{
  data?: GenericSingleDtoFinancingFacilityOtherBankResponseDto;
}

export interface ListFinancingFacilityOtherBankRequestDto {
  bucketProcessId: string;
  process: string;
  module: string;
}

export interface GenericBucketRequestDtoListFinancingFacilityOtherBankRequestDto {
  page?: PageRequestDto;
  sortList?: SortRequestDto;
  searchDetail?: SearchDetailRequestDto;
  filter?: ListFinancingFacilityOtherBankRequestDto;
}

export interface ListFinancingFacilityOtherBankResponseDto {
  id?: number;
  bucketProcessId?: string;
  process?: string;
  module?: string;
  debtorName?: string;
  bank?: string;
  bankLabel?: string;
  product?: string;
  plafond?: string;
  currencyPlafond?: string;
  plafondIdr?: string;
  outstanding?: string;
  currencyOutstanding?: string;
  outstandingIdr?: string;
  rates?: string;
  collectability?: string;
  collectabilityLabel?: string;
  callType?: string;
  isSyndication?: boolean;
  otherBankList?: Array<FacilityOtherBankResponseDto>;
}

export interface GenericBucketResponseDtoListFinancingFacilityOtherBankResponseDto {
  contents?: Array<ListFinancingFacilityOtherBankResponseDto>;
  page?: PageResponseDto;
}

export interface BaseResponseGenericBucketResponseDtoListFinancingFacilityOtherBankResponseDto extends GenericResponse{
  data?: GenericBucketResponseDtoListFinancingFacilityOtherBankResponseDto;
}

export interface SummaryOtherBankFacilityResponseDto {
  callType?: string;
  totalPlafond?: string;
  totalOutstanding?: string;
}

export interface FinancingFacilityOtherBankRequestDto {
  id?: number;
  bucketProcessId: string;
  process: string;
  module: string;
  debtorName?: string;
  product?: string;
  outstanding?: string;
  currencyOutstanding?: string;
  outstandingIdr?: string;
  rates?: string;
  collectability?: string;
  bankType?: string;
  bank?: string;
  plafond?: string;
  currencyPlafond?: string;
  plafondIdr?: string;
  exchangeRate?: string;
  currencyExchangeRate?: string;
  remark?: string;
  otherBank?: string;
  callType?: string;
  isSyndication?: boolean;
}

export interface FinancingFacilityAnnualReviewRequestDto {
  id?: number;
  annualReview?: boolean;
}
