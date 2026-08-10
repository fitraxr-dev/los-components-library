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

export interface AssignmentDetailResponseDto {
  picId?: number;
  name?: string;
  jobPosition?: string;
  jobPositionLabel?: string;
  division?: string;
  divisionLabel?: string;
  directorate?: number;
  directorateLabel?: string;
  startDate?: string;
  endDate?: string;
  isPermanent?: boolean;
  isLeader?: boolean;
}

export interface BucketResponseDto {
  bucketProcessId?: string;
  debtorId?: string;
  module?: string;
  process?: string;
  bucketParentId?: string;
  totalProposal?: string;
  debtorName?: string;
  groupName?: string;
  cif?: string;
  staffName?: string;
  staffDivision?: Array<string>;
  staffDivisionLabel?: string;
  division?: string;
  analystName?: string;
  analystId?: number;
  divisionId?: string;
  staffId?: number;
  createdAt?: string;
  modifiedAt?: string;
  modifiedBy?: string;
  status?: string;
  statusLabel?: string;
  aging?: string;
  dueDate?: string;
  referenceDocument?: string;
  referenceDocumentDate?: string;
  pic?: Array<AssignmentDetailResponseDto>;
  dataSource?: string;
  dataSourceLabel?: string;
  typeProcess?: string;
  typeProcessLabel?: string;
  typeSubmission?: string;
  typeSubmissionLabel?: string;
  financeType?: string;
  financeTypeLabel?: string;
  remarks?: string;
  institutionType?: string;
  institutionTypeLabel?: string;
  sector?: string;
  sectorLabel?: string;
  infrastructureSector?: string;
  infrastructureSectorLabel?: string;
  infrastructureSectorOther?: string;
  npwp?: string;
  gamId?: number;
  gamName?: string;
  groupId?: string;
  isNewClient?: boolean;
  totalPlafon?: number;
  currency?: string;
  technicalMeetingDate?: string;
  controllingParty?: string;
  bucketMaster?: string;
  bucketLabel?: string;
  tlApprovedBy?: string;
  tlApprovedate?: string;
  kadivApprovedBy?: string;
  kadivApprovedate?: string;
  additionalData?: object;
  creditorType?: string;
  creditorName?: string;
  eirr?: string;
  digitalMemoDocumentNo?: string;
  relatedProcess?: Array<string>;
  isRegionalGovern?: boolean;
  statusActive?: string;
}

export interface PageResponseDto {
  noPage?: number;
  itemPerPage?: number;
  totalPage?: number;
  totalData?: number;
}

export interface GenericBucketRequestDtoMapStringObject {
  page?: PageRequestDto;
  sortList?: SortRequestDto;
  searchDetail?: SearchDetailRequestDto;
  filter?: { [key: string]: object };
}

export interface GenericBucketResponseDtoBucketResponseDto {
  contents?: Array<BucketResponseDto>;
  page?: PageResponseDto;
}
