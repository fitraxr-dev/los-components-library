import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TAB = {
  HASIL_VERIFIKASI: 'HASIL_VERIFIKASI',
  PEMBAHASAN: 'PEMBAHASAN',
};

export const TAB_ITEMS = [
  {
    label: 'Pembahasan',
    value: TAB.PEMBAHASAN,
  },
  {
    label: 'Hasil Verifikasi',
    value: TAB.HASIL_VERIFIKASI,
  }
];

export const divisions = [
  { label: 'DH', value: 'DH_DIVISION' },
  { label: 'DK', value: 'DK_DIVISION' },
  { label: 'DEPI', value: 'DEPI_DIVISION' },
  { label: 'DELST - ESDD', value: 'SECOND_DELST_DIVISION' },
  { label: 'DELST - Teknis', value: 'DELST_DIVISION' }
];

export const TABLE_HEADER_CONSTANT: TableHeader[] = [
  {
    key: 'no',
    label: 'No',
    type: 'index',
  },
  {
    key: 'directorateLabel',
    label: 'Direktorat',
  },
  {
    key: 'divisionLabel',
    label: 'Divisi',
  },
  {
    key: 'staffName',
    label: 'Nama',
  },
  {
    key: 'jobPositionLabel',
    label: 'Jabatan',
  }
];

export const PERSETUJUAN_TITLE = [
  {
    key: '1',
    label: 'Divisi Pengusul / Anggota Komite Pembiayaan',
  },
  {
    key: '2',
    label: '⁠Anggota Komite Pembiayaan',
  },
  {
    key: '3',
    label: 'Ketua Rapat Komite Pembiayaan / Pejabat Berwenang Memutus ',
  },
  {
    key: '4',
    label: '⁠Anggota Komite Pembiayaan / Pejabat Berwenang Memutus',
  }
];

export const TABLE_HEADER_CONSENT_SHEET_CONSTANT: TableHeader[] = [
  {
    key: 'id',
    label: 'ID',
    type: 'index',
  },
  {
    key: 'directorateLabel',
    label: 'Direktorat',
  },
  {
    key: 'divisionLabel',
    label: 'Divisi',
  },
  {
    key: 'staffName',
    label: 'Nama',
  },
  {
    key: 'jobPositionLabel',
    label: 'Jabatan',
  }
];
