import type { TypeModule, TypeProcess } from '@/enums/Module';


export interface AlertDifferentDataProps {
  bucketProcessId: string;
  module: TypeModule;
  process: TypeProcess;
  refetchInterval?: number | false;
  isReviewer?: boolean;
}
