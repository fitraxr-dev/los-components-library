import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_HEADER: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'typeSpecialApprovalLabel',
    label: 'Persetujuan Khusus',
    sx: {
      minWidth: '9vw',
    },
  },
  {
    key: 'description',
    label: 'Deskripsi',
    sx: {
      minWidth: '12vw',
    },
  },
];

export const mockData = [
  {
    assessmentResult: 'Gatau',
    id: 'ASR-001',
    remark: 'Entahlah',
  }
];

export const modal = {
  MODAL_CDD_DETAIL: 'MODAL_CDD_DETAIL',
};
