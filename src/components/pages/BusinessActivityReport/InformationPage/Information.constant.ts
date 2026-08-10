export const tab = {
  BUSINESSCALLINFORMATION: 'businessCallInformation',
  FOLLOWUP: 'FollowUp',
};

export const TAB_ITEMS = [
  { label: 'Informasi Business Call', value: tab.BUSINESSCALLINFORMATION },
  { label: 'Pembahasan & Follow Up', value: tab.FOLLOWUP },
];

export interface InformationProps {
  type: 'add' | 'edit' | 'viewOnly';
}

export enum COMPONENT_TYPE {
  ADD = 'add',
  EDIT = 'edit',
  VIEWONLY = 'viewOnly'
}

export const modal = {
  CUSTOMER_DK_VALIDATION: 'CUSTOMER_DK_VALIDATION',
  EXISTING_USER: 'EXISTING_USER',
};
