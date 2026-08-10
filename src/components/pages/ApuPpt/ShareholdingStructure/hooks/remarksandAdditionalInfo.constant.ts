export type RemarksandAdditionalInfoRequestDto = {
  bucketProcessId: string;
  process: string;
  module: string;
  remark?: string;
  description?: any;
  options?: any;
  debtorId: string;
}
