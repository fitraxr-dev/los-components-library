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
  },
  {
    key: 'typeLabel',
    label: 'Tipe',
  },
  {
    key: 'shares',
    label: 'Lembar Saham',
  },
  {
    key: 'percentage',
    label: '%',
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
    percentage: '20',
    shares: '200',
    typeLabel: 'individual',
  },
  {
    id: '2345',
    lastCheckedDate: '01-31-2025',
    name: 'Jane Smith',
    percentage: '25',
    shares: '250',
    typeLabel: 'individual',
  },
  {
    id: '3456',
    lastCheckedDate: '01-30-2025',
    name: 'Alice Johnson',
    percentage: '30',
    shares: '300',
    typeLabel: 'corporate',
  },
  {
    id: '4567',
    lastCheckedDate: '01-29-2025',
    name: 'Bob Williams',
    percentage: '15',
    shares: '150',
    typeLabel: 'individual',
  },
  {
    id: '5678',
    lastCheckedDate: '01-28-2025',
    name: 'Emily Davis',
    percentage: '10',
    shares: '100',
    typeLabel: 'corporate',
  },
];
