import { formatDate } from '@/helpers/date';
import { formatCurrency } from '@/helpers/formatCurrency';

import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const tableHeaderList: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'processId',
    label: 'ID Process',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'applicationNo',
    label: 'Application No',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'facilityCore',
    label: 'Core Facility ID',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'facilityId',
    label: 'Facility ID',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'facilityNo',
    label: 'Facility No',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'financingSegmentDesc',
    label: 'Facility Segment',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'financingType',
    label: 'Financing Type',
    render: (data) => (
      <TextStyle>{data.productType === 'KMK Revolving' || data.productType === 'Dana Talangan Revolving' ? 'Revolving' : 'Aflopend'}</TextStyle>
    ),
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'productType',
    label: 'Product Type',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'activationDate',
    label: 'Activation Date',
    render: (data) => (
      <TextStyle>{(!data.activationDate || data.activationDate === '') ? '-' : formatDate(data.activationDate)}</TextStyle>
    ),
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'currency',
    label: 'Mata Uang',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'plafond',
    label: 'Plafond',
    render: (data) => (
      // <TextStyle>{(!data.plafond || data.plafond === '') ? '-' : formatCurrency(data.plafond.toString())}</TextStyle>
      <TextStyle>{(!data.plafond || data.plafond === '') ? '-' : data.plafond.toString().includes('-') ? '-' + formatCurrency(data.plafond.toString()) : formatCurrency(data.plafond.toString())}</TextStyle>

    ),
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'os',
    label: 'O/S',
    render: (data) => (
      // <TextStyle>{(!data.os || data.os === '') ? '-' : formatCurrency(data.os.toString())}</TextStyle>
      <TextStyle>{(!data.os || data.os === '') ? '-' : data.os.toString().includes('-') ? '-' + formatCurrency(data.os.toString()) : formatCurrency(data.os.toString())}</TextStyle>

    ),
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'pic',
    label: 'PIC',
    sx: {
      minWidth: '10vw',
    },
  },
];

export const mockTableData = [
  {
    activationDate: '2024-10-25',
    applicationNumber: '1234567890',
    currency: 'USD',
    facilityId: '1234567890',
    facilityNumber: '1234567890',
    financingType: 'Conventional',
    os: '100000000',
    pic: 'John Doe',
    plafond: '100000000',
    processId: '1234567890',
    productType: 'Conventional',
    statusLabel: 'Approved',
  },
  {
    activationDate: '2024-10-25',
    applicationNumber: '1234567890',
    currency: 'USD',
    facilityId: '1234567890',
    facilityNumber: '1234567890',
    financingType: 'Conventional',
    os: '100000000',
    pic: 'John Doe',
    plafond: '100000000',
    processId: '1234567890',
    productType: 'conventional',
    statusLabel: 'Approved',
  },
];
