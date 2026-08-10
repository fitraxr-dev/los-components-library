import type { TableHeader } from '@/components/shared/Table/Table.types';


export const tableHeader: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: { minWidth: '4vw' },
    type: 'index',
  },
  {
    key: 'groupName',
    label: 'Nama Group',
    sx: { minWidth: '12vw' },
  },
  {
    key: 'leewayDebtorGroup',
    label: 'Kelonggaran BMPP terhadap kelompok Customer',
    sx: { minWidth: '15vw' },
  },
  {
    key: 'percentage',
    label: 'Presentase BMPP Group',
    sx: { minWidth: '15vw' },
  },
  {
    key: 'conclusion',
    label: 'Kesimpulan BMPP Kelompok Customer',
    sx: { minWidth: '15vw' },
  },
];
