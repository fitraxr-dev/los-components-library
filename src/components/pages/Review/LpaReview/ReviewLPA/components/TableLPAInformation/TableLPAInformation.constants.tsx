import { toDateString } from '@/helpers/date';

import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_HEADER_LIST_LPA_REVIEW: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'kjpp',
    label: 'Nama KJPP',
  },
  {
    key: 'reportNo',
    label: 'Nomor Laporan',
  },
  {
    key: 'reportDate',
    label: 'Tanggal Laporan',
    render: (row) => (
      <TextStyle variant="body4">{row.reportDate ? toDateString(row.reportDate) : '-'}</TextStyle>
    ),
  },
  {
    key: 'assessmentDate',
    label: 'Tanggal Penilaian',
    render: (row) => (
      <TextStyle variant="body4">{row.assessmentDate ? toDateString(row.assessmentDate) : '-'}</TextStyle>
    ),
  },
  {
    key: 'remark',
    label: 'Keterangan',
  },
];


export const TABLE_HEADER_LIST_LPA: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'kjpp',
    label: 'Nama KJPP',
  },
  {
    key: 'reportNo',
    label: 'Nomor Laporan',
  },
  {
    key: 'reportDate',
    label: 'Tanggal Laporan',
    render: (row) => (
      <TextStyle variant="body4">{row.reportDate ? toDateString(row.reportDate) : '-'}</TextStyle>
    ),
  },
  {
    key: 'assessmentDate',
    label: 'Tanggal Penilaian',
    render: (row) => (
      <TextStyle variant="body4">{row.assessmentDate ? toDateString(row.assessmentDate) : '-'}</TextStyle>
    ),
  },
  {
    key: 'assessmentObject',
    label: 'Objek Penilaian',
  },
  {
    key: 'totalMarketValue',
    label: 'Nilai Pasar',
  },
];
