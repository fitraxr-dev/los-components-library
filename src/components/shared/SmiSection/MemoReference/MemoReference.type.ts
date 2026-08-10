import type { TypeModule, TypeProcess } from '@/enums/Module';


export type MemoReferenceProps = {
  module: TypeModule;
  process: TypeProcess;
  childProcess?: TypeProcess;
  bucketProcessId: string;
}
