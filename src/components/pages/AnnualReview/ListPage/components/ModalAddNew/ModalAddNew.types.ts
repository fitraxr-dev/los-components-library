export type ActiveData = {
  // bucketProcessId: string;
  cif: string;
  debtorId: string;
  debtorName: string;
  npwp: string;
  staffName: string;
  divisionName: string;
  gamName: string;
  institutionTypeLabel: string;
  // groupName: string;
  // process: string;
  // processLabel: string;
  id: string;
}

export interface ValidationRequestDto {
  debtorId?: string;
  process?: string;
  module?: string;
}

export interface BucketCreateRequestDto {
  module?: string;
  process?: string;
  debtorId?: string;
  bucketProcessId?: string;
  comment?: string;
  additionalData?: object;
  syncWithLatestSubmission?: boolean;
  isGroup?: boolean;
  isRelatedToSmi?: boolean;
  debtorType?: string;
  debtorRating?: string;
}
