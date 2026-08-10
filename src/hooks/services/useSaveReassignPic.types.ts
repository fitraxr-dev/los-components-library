export interface BucketAssignmentDto {
  picId?: number;
  previousPicId?: number;
  startDate?: string;
  endDate?: string;
  isPermanent?: boolean;
  isLeader?: boolean;
}

export interface ReAssignmentRequestDto {
  bucketProcessId?: string;
  picList?: Array<BucketAssignmentDto>;
}

export interface ReAssignmentListRequestDto {
  module?: string;
  process?: string;
  reAssign?: Array<ReAssignmentRequestDto>;
}
