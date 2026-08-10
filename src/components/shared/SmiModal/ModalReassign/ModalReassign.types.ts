import type { TypeModule, TypeProcess } from '@/enums/Module';
import type { Dispatch, SetStateAction } from 'react';
import type {
  Control,
  FieldValues,
  UseFieldArrayAppend,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';


export type PIC = {
  id: number;
  directorate: string;
  division: string;
  endDate: string;
  isLeader: boolean;
  isPermanent: boolean;
  jobPosition: string;
  name: string;
  startDate: string;
  index: number;
  picId?: string;
}

export type Task = {
  id: string;
  debtorName: string;
  division: string;
  divisionId: string;
  rmName: string;
  pic: Array<PIC>;
  aging: string;
  dueDate: string;
  status: string;
  createdAt: string;
  process?: string;
  module?: string;
}

export type UseFormValues = {
  control: Control<FieldValues, any>;
  setValue: UseFormSetValue<FieldValues>;
  watch: UseFormWatch<FieldValues>;
};

export type UseModalReassignProps = ModalReassignProps & {
  append: UseFieldArrayAppend<FieldValues, 'picList'>;
  useFormValues: UseFormValues;
  divisionId: string;
}

export type UserRoleObj = {
  id: number;
  name: string;
}

export type SelectedTaskReassign = {
  pic: Array<{
    reAssignTo: {
      previousPicId: string;
      id: number;
      endDate: string;
      startDate: string;
      isLeader: boolean;
      isPermanent: boolean;
      name: string;
      picId: string;
      division: string;
      directorate: string;
    };
  }>;
  debtorName: string;
  division: string;
  aging: string;
  status: string;
  dueDate: string;
  rmName: string;
  createdAt: string;
  id: string;
  module?: string;
  process?: string;
}

export type ModalReassignProps = {
  selectedTask: Array<Task>;
  setSelectedTask: Dispatch<SetStateAction<Array<Task>>>;
  module: TypeModule;
  process: TypeProcess;
  selectedTaskReassign: SelectedTaskReassign[];
  setSelectedTaskReassign: Dispatch<SetStateAction<Array<Task>>>;
  divisionId: string;
  position?: string;
  isRiviewAssign?: boolean;
  isMonitoring?: boolean;
  watchedPicList?: Array<any>;
}
