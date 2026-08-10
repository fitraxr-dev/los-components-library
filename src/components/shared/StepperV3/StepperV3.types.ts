import type { TypeModule, TypeProcess } from '@/enums/Module';


export type StepperV2Props = {
  module: TypeModule;
  process: TypeProcess;
  bucketProcessId?: string;
  menuCode?: string;
  customProgress?: number;
}
