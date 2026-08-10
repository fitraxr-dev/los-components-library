import type { TypeModule, TypeProcess } from '@/enums/Module';
import type { Dispatch, SetStateAction } from 'react';


type Task = {
  bucketProcessId: string;
  debtorName: string;
  divisionId: string;
}

export type ModalAssignProps = {
  selectedTask: Array<Task>;
  setSelectedTask: Dispatch<SetStateAction<Array<Task>>>;
  module: TypeModule;
  process: TypeProcess;
  position?: string;
}
