import type { TableHeader } from '@/components/shared/Table/Table.types';


export const tabs = {
  generalInformation: 'general-information',
  internalAssessment: 'internal-assessment',
};


export const tabItems = [
  { label: 'General Information', value: tabs.generalInformation },
  { label: 'Internal Assessment', value: tabs.internalAssessment },
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
  },
  {
    key: 'nik',
    label: 'NIK',
  },
  {
    key: 'jobPosition',
    label: 'Jabatan',
  },
  {
    key: 'lastCheckedDate',
    label: 'Last Checked Date',
  },
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
