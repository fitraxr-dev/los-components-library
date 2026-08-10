import type { ExposureGroupBucketResponseDto } from '@/services/openapi/bucket-service';


export type ExposureGroupSectionProps = {
  data: Array<ExposureGroupBucketResponseDto>;
  valueAsOf?: string;
  showTooltip?: boolean;
  isAsOf?: boolean;
}
