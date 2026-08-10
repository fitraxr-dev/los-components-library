import type { TableHeader } from '@/components/shared/Table/Table.types';


export const tableHeaderList: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'syariahLimitId',
    label: 'ID',
    sx: {
      minWidth: '8vw',
    },
  },
  {
    key: 'cifKelompok',
    label: 'CIF Kelompok',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'onlineFacilityValue',
    label: 'Nominal Fasilitas',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'maxUsage',
    label: 'Maksimal Penggunaan',
    sx: {
      minWidth: '14vw',
    },
  },
  {
    key: 'activationDate',
    label: 'Tanggal Berlaku',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'reviewFrequency',
    label: 'Frekuensi Review',
    sx: {
      minWidth: '14vw',
    },
  },
];
