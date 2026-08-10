import type { TypeModule, TypeProcess } from '@/enums/Module';


export type ReportingListRoutineTypes = {
  module: TypeModule;
  process: TypeProcess;
  isBusinessResponse?: boolean;
};
