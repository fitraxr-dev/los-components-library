import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_HEADER: TableHeader[] = [
  { key: 'index', label: 'No', sx: { minWidth: '4vw' }, type: 'index' },
  { key: 'parameterCode', label: 'Kode Parameter', sx: { minWidth: '12vw' } },
  { key: 'parameterName', label: 'Nama Parameter', sx: { minWidth: '15vw' } },
  { key: 'status', label: 'Status', sx: { minWidth: '8vw' }, type: 'status' },
  { key: 'requestedBy', label: 'Requested By', sx: { minWidth: '10vw' } },
  { key: 'requestedDate', label: 'Requested Date', sx: { minWidth: '10vw' }, type: 'date' },
  { key: 'approvedBy', label: 'Approved By', sx: { minWidth: '10vw' } },
  { key: 'approvedDate', label: 'Approved Date', sx: { minWidth: '10vw' }, type: 'date' },
];

export const MODAL = {
  APPROVAL_STATUS_MODAL: 'APPROVAL_STATUS_MODAL_PARAMETER',
} as const;

export const MOCK_DATA_LENGTH = 25;
export const DEFAULT_PAGE_SIZE = 10;
