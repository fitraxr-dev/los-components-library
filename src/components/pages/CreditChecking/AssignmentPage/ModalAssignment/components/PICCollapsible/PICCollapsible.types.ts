import type { UseFieldArrayRemove } from 'react-hook-form';


export type PIC = {
  id?: string | number;
  directorate: string;
  division: string;
  jobPosition: string;
  isLeaderPIC: boolean;
  label: string;
  picId: string;
}

export type PICCollapsibleProps = {
  index: number;
  onDelete: UseFieldArrayRemove;
  totalPIC: number;
  divisionId: string;
  position?: string;
}

export type PICCollapsibleHookProps = {
  index: number;
  divisionId: string;
  position?: string;
}
