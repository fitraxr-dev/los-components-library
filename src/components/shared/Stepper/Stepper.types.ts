import type { StepProcessMipResponseDto } from '@/services/openapi/mip-service';


export type StepperProps = {
  steps: StepProcessMipResponseDto[];
  onClick: (path: string, viewOnly?: boolean) => void;
}
