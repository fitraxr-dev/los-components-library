import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_HEADER_FACILITY_AGENT_TABLE: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'agentLabel',
    label: 'Facility Agent',
    sx: { maxWidth: '16vw', minWidth: '15vw' },
  },
];

export const TABLE_HEADER_ACCOUNT_AGENT_TABLE: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'agentLabel',
    label: 'Account Agent',
    sx: { maxWidth: '16vw', minWidth: '15vw' },
  },
];

export const TABLE_HEADER_SECURITY_AGENT_TABLE: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'agentLabel',
    label: 'Security Agent',
    sx: { maxWidth: '16vw', minWidth: '15vw' },
  },
];
