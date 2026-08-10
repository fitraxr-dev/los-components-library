import type { Dayjs } from 'dayjs';


export type PopupManagementForm = {
  name: string;
  jobPosition: string;
  npwp: string;
  npwpFile: FileOutput;
  nik: string;
  nikFile: FileOutput;
  dob: Dayjs;
  collectibility: string;
  googleResult: string;
  resultReporting: string;
  note: string;
}

export type PopupManagementProps = {
  id?: number;
  module?: string;
  isRequestMode?: boolean;
  modalId?: any;
};
