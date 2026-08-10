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
    key: 'projectId',
    label: 'Proyek',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'productLabel',
    label: 'Financial Scheme',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'akad',
    label: 'Akad',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'activationDate',
    label: 'Activation Date',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'currencyOrderValue',
    label: 'Mata Uang',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'orderValue',
    label: 'Plafond',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'outstanding',
    label: 'O/S',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'accountOfficer',
    label: 'PIC',
    sx: {
      minWidth: '10vw',
    },
  },
];

export const mockTableData = [
  {
    activationDate: '-',
    applicationNumber: '-',
    childCode: '-',
    childFacilityId: '-',
    childFacilityNumber: '-',
    contract: '-',
    currency: '-',
    masterCode: '-',
    masterFacilityId: '-',
    masterFacilityNumber: '-',
    os: '-',
    pic: '-',
    plafond: '-',
    processId: '-',
    productType: '-',
    project: '-',
    statusLabel: 'Approved',
  },
];
