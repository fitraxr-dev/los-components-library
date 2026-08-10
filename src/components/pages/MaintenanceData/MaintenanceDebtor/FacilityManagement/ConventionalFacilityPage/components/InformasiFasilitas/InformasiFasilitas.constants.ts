import * as Yup from 'yup';


export const tab = {
  BUSINESSHOLIDAYCOUNTRY: 'businessHolidayCountry',
  DETAILMULTIRATE: 'detailMultiRate',
  FACILITYDATA: 'facilityData',
  FACILITYDATADETAIL: 'facilityDataDetail',
  FACILITYFEE: 'facilityFee',
  INTERESTDURINGCONSTRUCTIONS: 'interestDuringConstructions',
  NOTIFICATION: 'notification',
};

export const TAB_ITEMS = [
  { label: 'Facility Data', value: tab.FACILITYDATA },
  { label: 'Facility Data Detail', value: tab.FACILITYDATADETAIL },
  { label: 'Detail Multi Rate', value: tab.DETAILMULTIRATE },
  { label: 'Notification', value: tab.NOTIFICATION },
  { label: 'Business Holiday Country', value: tab.BUSINESSHOLIDAYCOUNTRY },
  { label: 'Interest During Constructions', value: tab.INTERESTDURINGCONSTRUCTIONS },
  { label: 'Facility Fee', value: tab.FACILITYFEE },
];

export interface InformationProps {
  type: 'add' | 'edit' | 'viewOnly';
}

export enum COMPONENT_TYPE {
  ADD = 'add',
  EDIT = 'edit',
  VIEWONLY = 'viewOnly'
}
