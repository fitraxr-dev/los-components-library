import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_HEADER: TableHeader[] = [
  { key: 'index', label: 'No', sx: { minWidth: '1vw' }, type: 'index' },
  { key: 'bucketProcessId', label: 'ID Proses', sx: { minWidth: '1vw' } },
  { key: 'code', label: 'Tipe Business Call', sx: { minWidth: '1vw' } },
  { key: 'description', label: 'Kategori Business Call', sx: { minWidth: '1vw' } },
  { key: 'modifiedBy', label: 'Modified By', sx: { minWidth: '1vw' } },
  { key: 'modifiedDate', label: 'Last Modified', sx: { minWidth: '1vw' }, type: 'date' },
  { key: 'status', label: 'Status', sx: { minWidth: '1vw' }, type: 'status' },
  { key: 'action', label: 'Action', sx: { minWidth: '1vw' }, type: 'action' },
];

export const MODAL = {
  APPROVAL_STATUS_MODAL: 'APPROVAL_STATUS_MODAL_PARAMETER',
} as const;

export const MOCK_DATA_LENGTH = 25;
export const DEFAULT_PAGE_SIZE = 10;
