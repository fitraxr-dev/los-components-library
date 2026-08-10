import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_HEADER: TableHeader[] = [
  {
    key: 'dataMaster',
    label: 'Master Data',
  },
  {
    key: 'code',
    label: 'Kode',
  },
  {
    key: 'description',
    label: 'Deskripsi',
  },
  {
    key: 'active',
    label: 'Active',
  },
];

export const modal = {
  APPROVAL_MASTER_MODAL: 'APPROVAL_MASTER_MODAL',
  DETAIL_MODAL: 'DETAIL_MODAL',
};
