import * as yup from 'yup';

import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const facilityFeeSchema = yup.object().shape({
  amount: yup
    .number()
    .nullable()
    .when('inputType', {
      is: 'amount',
      otherwise: (schema) => schema.nullable().optional(),
      then: (schema) => schema.required('Amount harus diisi'),
    }),
  basicType: yup.string().required('Basic Type harus diisi'),
  inputType: yup.string().required('Input Type harus diisi'),
  percentage: yup
    .number()
    .nullable()
    .when('inputType', {
      is: 'percentage',
      otherwise: (schema) => schema.nullable().optional(),
      then: (schema) => schema.required('Percentage harus diisi'),
    }),
  typeOfFee: yup.string().required('Type of Fee harus diisi'),
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
    key: 'typeOfFeeLabel',
    label: 'Type of Fee',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'inputType',
    label: 'Input Type',
    render: (row) => (
      <TextStyle variant="body4">
        {row?.inputType ? `${row?.inputType?.charAt(0).toUpperCase() + row?.inputType?.slice(1)}` : '-'}
      </TextStyle>
    ),
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'amount',
    label: 'Amount',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'percentage',
    label: 'Percentage',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'basicTypeLabel',
    label: 'Basis Type',
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
  MODAL_ADD: 'MODAL_ADD_FACILITY_FEE',
};
