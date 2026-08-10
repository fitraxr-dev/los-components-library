import * as Yup from 'yup';


export const tab = {
  FACILITYINFORMATION: 'facilityInformation',
  INFORMASISINDIKASI: 'informasiSindikasi',
  LAINNYA: 'lainnya',
  PROJECT: 'project',
  VIRTUALACCOUNT: 'virtualAccount',
};

export const TAB_ITEMS = [
  // { label: 'Facility Information', value: tab.FACILITYINFORMATION },
  { label: 'Project', value: tab.PROJECT },
  { label: 'Informasi Sindikasi', value: tab.INFORMASISINDIKASI },
  // { label: 'Virtual Account', value: tab.VIRTUALACCOUNT },
  { label: 'Lainnya', value: tab.LAINNYA },
];

export interface InformationProps {
  type: 'add' | 'edit' | 'viewOnly';
}

export enum COMPONENT_TYPE {
  ADD = 'add',
  EDIT = 'edit',
  VIEWONLY = 'viewOnly'
}
