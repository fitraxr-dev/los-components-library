import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TableHeaderList: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    sx: { minWidth: '6vw' },
    type: 'index',
  },
  {
    key: 'collectability',
    label: 'Collectability',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'status',
    label: 'Status Collectability per',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'highRisk',
    label: 'High Risk',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'statusHighRiskDate',
    label: 'Status High Risk Date',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'division',
    label: 'Division',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'lastModified',
    label: 'Last Modified',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'modifiedBy',
    label: 'Modified By',
    sx: { minWidth: '10vw' },
  },
];
