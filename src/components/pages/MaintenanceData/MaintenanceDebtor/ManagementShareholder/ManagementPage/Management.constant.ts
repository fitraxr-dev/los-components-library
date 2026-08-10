import type { TableHeader } from '@/components/shared/Table/Table.types';


export const tabs = {
  LIST_FACILITY: 'list-facility-related',
  PROJECT: 'project',
};

export const tabItems = [
  { label: 'Project', value: tabs.PROJECT },
  { label: 'List Facility Related', value: tabs.LIST_FACILITY },
];


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
    label: 'Nama',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'jobPositionLabel',
    label: 'Jabatan',
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'lastCheckedDate',
    label: 'Last Checked Date',
    sx: {
      minWidth: '12vw',
    },
    type: 'date',
  }
];

export const mockTableData = [
  {
    id: '1234',
    lastCheckedDate: '02-01-2025',
    name: 'John Doe',
    nik: '123456789012345',
    position: 'Staff',
  },
  {
    id: '2345',
    lastCheckedDate: '01-31-2025',
    name: 'Jane Smith',
    nik: '987654321098765',
    position: 'Manager',
  },
  {
    id: '3456',
    lastCheckedDate: '01-30-2025',
    name: 'Alice Johnson',
    nik: '567890123456789',
    position: 'Supervisor',
  },
  {
    id: '4567',
    lastCheckedDate: '01-29-2025',
    name: 'Bob Williams',
    nik: '234567890123456',
    position: 'Staff',
  },
  {
    id: '5678',
    lastCheckedDate: '01-28-2025',
    name: 'Emily Davis',
    nik: '345678901234567',
    position: 'Director',
  },
];
