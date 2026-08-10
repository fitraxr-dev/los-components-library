import * as Yup from 'yup';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const multiRateSchema = Yup.object().shape({
  baseRate: Yup.string().notRequired().nullable(),
  margin: Yup.string().required('Margin harus diisi'),
  period: Yup.string().required('Period harus diisi'),
  totalEffectiveRate: Yup.string().required('Total Effective Rate harus diisi'),
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
    key: 'period',
    label: 'Period (Year)',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'baseRate',
    label: 'Base Rate',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'margin',
    label: 'Margin',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'totalEffectiveRate',
    label: 'Total Effective Rate',
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
  MODAL_ADD: 'MODAL_ADD_DETAIL_MULTI_RATE',
};
