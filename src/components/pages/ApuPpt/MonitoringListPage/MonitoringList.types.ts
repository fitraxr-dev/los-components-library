type PIC = {
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
}

export type Task = {
  id: string;
  debtorName: string;
  division: string;
  rmName: string;
  pic: Array<PIC>;
  aging: string;
  dueDate: string;
  status: string;
  createdAt: string;
}
