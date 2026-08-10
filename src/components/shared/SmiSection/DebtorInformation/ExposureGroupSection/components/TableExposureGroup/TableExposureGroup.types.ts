import type { ExposureGroupBucketResponseDto } from '@/services/openapi/bucket-service';


export type ExposureGroupBaseProps = {
  data: Array<ExposureGroupBucketResponseDto & {viewOnly?: boolean}>;
}
