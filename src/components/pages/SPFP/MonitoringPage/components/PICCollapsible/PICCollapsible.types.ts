import type { UseFormValues } from '@/components/pages/CreditChecking/MonitoringPage/Monitoring.types';


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
}

export type PICCollapsibleProps = {
  picData: PIC;
  picList: Array<PIC>;
  useFormValues: UseFormValues;

}
