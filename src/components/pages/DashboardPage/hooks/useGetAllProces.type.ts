// DTO untuk pagination
export interface PageResponseDto {
  noPage?: number;
  itemPerPage?: number;
  totalPage?: number;
  totalData?: number;
}

// DTO untuk data inquiry
export interface InquiryResponseDto {
  bucketMasterId?: string;
  bucketProcessId?: string;
  module?: string;
  process?: string;
  processLabel?: string;
  label?: string;
  commitment?: string;
  debtorName?: string;
  groupName?: string;
  staffName?: string;
  createdDate?: string;
  status?: string;
  statusLabel?: string;
  url?: string;
}

// DTO utama yang berisi list Inquiry dan pagination
export interface GenericBucketResponseDtoInquiryResponseDto {
  contents?: Array<InquiryResponseDto>;
  page?: PageResponseDto;
}
