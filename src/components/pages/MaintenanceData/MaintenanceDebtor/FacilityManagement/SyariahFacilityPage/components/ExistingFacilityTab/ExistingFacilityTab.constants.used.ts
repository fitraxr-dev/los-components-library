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
    key: 'masterCode',
    label: 'Kode Induk',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'masterFacilityId',
    label: 'Fasilitas Induk ID',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'childCode',
    label: 'Kode Anak',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'childFacilityId',
    label: 'Fasilitas Anak ID',
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
    key: 'contract',
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
    key: 'currency',
    label: 'Mata Uang',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'plafond',
    label: 'Plafond',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'os',
    label: 'O/S',
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
