/**
 * Interface for recording user activity logs
 */
export interface RecordLogRequest {
  bucketProcessId: string;
  process: string;
  module: string;
  menuCode: string;
  activity: string;
  changeBefore: string;
  changeAfter: string;
  remarks: string;
}

/**
 * Interface for the record log response
 */
export interface RecordLogResponse {
  success: boolean;
  message?: string;
  data?: any;
}

/**
 * Interface for the useRecordLog hook parameters
 */
export interface UseRecordLogParams {
  activity?: string;
  bucketProcessId?: string;
  process?: string;
  menuCode?: string;
  module?: string;
  menuCode?: string;
  changeBefore?: string;
  changeAfter?: string;
  remarks?: string;
}
