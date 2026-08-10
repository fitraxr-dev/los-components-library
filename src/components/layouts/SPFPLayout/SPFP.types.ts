import type { TypeModule, TypeProcess } from '@/enums/Module';


export type ModuleProps = {
  module: TypeModule;
  process: TypeProcess;
  bucketProcessId: string;
}
