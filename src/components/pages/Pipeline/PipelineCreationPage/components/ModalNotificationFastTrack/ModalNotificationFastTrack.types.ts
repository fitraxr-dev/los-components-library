import type { BucketResponseDto } from '@/services/openapi/bucket-service';


export type NotificationFormValues = {
  depiStaff: string[];
  dhStaff: string[];
}

export type NotificationRecipients = {
  depiStaffIds: number[];
  dhStaffIds: number[];
  pipelineStaffId?: number;
}

export type ModalNotificationFastTrackProps = {
  onSave: (values: NotificationFormValues) => void;
  pipelineDetail: BucketResponseDto;
  processId: string;
}
