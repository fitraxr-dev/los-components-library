import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_HEADER: TableHeader[] = [
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
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'jobPositionLabel',
    label: 'Jabatan',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'lastCheckedDate',
    label: 'Last Checked Date',
    sx: { minWidh: '12vw' },
    type: 'date',
  },
];

export const TABLE_HEADER_RESULT: TableHeader[] = [
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
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'collectabilityLabel',
    label: 'Kolektabilitas',
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'ref',
    label: 'Ref',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'resultReporting',
    label: 'Hasil Laporan',
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'note',
    label: 'Catatan',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'googleResult',
    label: 'Google Search',
    sx: {
      minWidth: '10vw',
    },
  },
];

export const TABLE_HEADER_SUMMARY: TableHeader[] = [
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
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'collectabilityLabel',
    label: 'Kolektabilitas',
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'ref',
    label: 'Ref',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'resultReporting',
    label: 'Hasil Laporan',
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'note',
    label: 'Catatan',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'googleResult',
    label: 'Google Search',
    sx: {
      minWidth: '10vw',
    },
  },
];

export const TABLE_HEADER_REQUEST: TableHeader[] = [
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
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'jobPositionLabel',
    label: 'Jabatan',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'lastCheckedDate',
    label: 'Last Checked Date',
    sx: { minWidth: '8vw' },
    type: 'date',
  }
];

export const TABLE_HEADER_DOCUMENT_VERIFICATION: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
];

export const TABLE_HEADER_UPLOAD_RESULT: TableHeader[] = [
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
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'nik',
    label: 'NIK',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'jobPositionLabel',
    label: 'Jabatan',
    sx: {
      minWidth: '12vw',
    },
  },
];
