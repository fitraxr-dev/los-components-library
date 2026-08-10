import type { SelectedTaskReassign, Task, UseFormValues } from '../../ModalReassign.types';
import type { Dispatch, SetStateAction } from 'react';


export type PIC = {
  directorate: number;
  directorateLabel: string;
  division: number;
  divisionLabel: string;
  index: number;
  isLeader: boolean;
  jobPosition: number;
  jobPositionLabel: string;
  name: string;
  picId: number;
  id: string;
  reAssignTo: {
    id: number;
    directorate: number;
    directorateLabel: string;
    division: number;
    divisionLabel: string;
    endDate: string;
    startDate: string;
    isPermanent: boolean;
    isLeader: boolean;
    jobPosition: number;
    jobPositionLabel: string;
    name: string;
    picId: number;
  };
  taskId: string;
  isProcessAnalyst?: boolean;
  isTechnicalStaff?: boolean;
}

export type PICCollapsibleProps = {
  picData: PIC;
  picList: Array<PIC>;
  useFormValues: UseFormValues;
  selectedTaskReassign: SelectedTaskReassign[];
  setSelectedTaskReassign: Dispatch<SetStateAction<Array<Task>>>;
  divisionId: string;
  position?: string;
  isRiviewAssign?: boolean;
  isMonitoring?: boolean;
}
