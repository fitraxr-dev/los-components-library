import * as Yup from 'yup';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const businessHolidayCountrySchema = Yup.object().shape({
  calenderCode: Yup.string().nullable().notRequired(),
  calenderName: Yup.string().required('Calendar Name Harus Diisi'),
});

export const tableHeader: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'calenderCode',
    label: 'Calendar Code',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'calenderName',
    label: 'Calendar Name',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'modifiedBy',
    label: 'Modified By',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'modifiedDate',
    label: 'Last Modified',
    sx: {
      minWidth: '10vw',
    },
  },
];

export const modal = {
  MODAL_ADD: 'MODAL_ADD',
};
