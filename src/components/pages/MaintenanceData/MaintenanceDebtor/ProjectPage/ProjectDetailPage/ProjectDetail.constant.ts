import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TableHeaderList: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    sx: {
      width: '4vw',
    },
    type: 'index',
  },
  {
    key: 'facilityId',
    label: 'Facility ID',
  },
  {
    key: 'facilityNumber',
    label: 'Facility No',
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
