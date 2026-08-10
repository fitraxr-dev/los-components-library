import type { BucketResponseDto } from '@/services/openapi/bucket-service';


export type PipelineDataOnlyProps = {
  data: BucketResponseDto & {
    refinaId?: string;
  };
}
