import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TableHeaderList: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'name',
    label: 'Customer Name',
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
    key: 'pic',
    label: 'PIC',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'productType',
    label: 'Produk',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'facilityStatus',
    label: 'Status Fasilitas',
    sx: {
      minWidth: '10vw',
    },
    type: 'status',
  },

];

export const mockTableData = [
  {
    facilityId: '12345',
    facilityNumber: '23',
  },
  {
    facilityId: '23456',
    facilityNumber: '51',
  },
  {
    facilityId: '34567',
    facilityNumber: '92',
  },
  {
    facilityId: '45678',
    facilityNumber: '12',
  },
];
