export interface BucketAssignmentDto {
  picId?: number;
  previousPicId?: number;
  startDate?: string;
  endDate?: string;
  isPermanent?: boolean;
  isLeader?: boolean;
}

export interface AssignmentRequestDto {
  module?: string;
  process?: string;
  bucketProcessIdList?: Array<string>;
  picList?: Array<BucketAssignmentDto>;
}
