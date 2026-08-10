import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_HEADER: TableHeader[] = [
  { key: 'index', label: 'No', type: 'index' },
  { key: 'parameterCode', label: 'Kode Parameter' },
  { key: 'parameterName', label: 'Nama Parameter' },
  { key: 'status', label: 'Status', type: 'status' },
  { key: 'requestedBy', label: 'Requested By' },
  { key: 'requestedDate', label: 'Requested Date' },
  { key: 'approvedBy', label: 'Approved By' },
  { key: 'approvedDate', label: 'Approved Date' },
];

export const MODAL = {
  APPROVAL_STATUS_MODAL: 'APPROVAL_STATUS_MODAL_PARAMETER',
} as const;

export const MOCK_DATA_LENGTH = 25;
export const DEFAULT_PAGE_SIZE = 10;
