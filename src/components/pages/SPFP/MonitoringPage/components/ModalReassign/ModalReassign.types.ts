import type { Task, UseFormValues } from '../../Monitoring.types';
import type { Dispatch, SetStateAction } from 'react';
import type { FieldValues, UseFieldArrayAppend } from 'react-hook-form';


export type UseModalReassignProps = ReassignToModalProps & {
  append: UseFieldArrayAppend<FieldValues, 'picList'>;
  useFormValues: UseFormValues;

}

export type SelectedReassignTask = Task & {
  pic: Array<{
    currentPIC: {
      directorate: string;
      division: string;
      isLeader: boolean;
      jobPosition: string;
      name: string;
      picId: number;
      reAssignTo: {
        directorate: string;
        division: string;
        endDate: string;
        startDate: string;
        isPermanent: boolean;
        jobPosition: string;
        name: string;
      };
    };
    newPIC: string;
  }>;
  rmName: string;
  status: string;
  statusLabel: string;
}

export type UserRoleObj = {
  id: number;
  name: string;
}

export type ReassignToModalProps = {
  selectedTask: Array<Task>;
  setSelectedTask: Dispatch<SetStateAction<Array<Task>>>;
}
