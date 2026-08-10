import type { TypeModule, TypeProcess } from '@/enums/Module';


export interface AlertRisalahRapatProps {
  bucketProcessId: string;
  module: TypeModule;
  process: TypeProcess;
  refetchInterval?: number | false;
}
