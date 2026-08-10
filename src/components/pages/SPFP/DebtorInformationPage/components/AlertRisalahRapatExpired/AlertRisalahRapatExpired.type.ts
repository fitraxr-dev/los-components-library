import type { TypeModule, TypeProcess } from '@/enums/Module';


export interface AlertRisalahRapatExpiredProps {
  bucketProcessId: string;
  module: TypeModule;
  process: TypeProcess;
  refetchInterval?: number | false;
}
