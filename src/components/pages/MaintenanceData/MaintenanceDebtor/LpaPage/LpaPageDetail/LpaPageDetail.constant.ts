import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TableHeaderAgunan: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'typeLabel',
    label: 'Jenis Agunan',
  },
  {
    key: 'indicationLiquidationValue',
    label: 'indikasi Nilai Likuidasi',
  },
  {
    key: 'marketValue',
    label: 'Nilai Pasar',
  },
  {
    key: 'total',
    label: 'Luas Tanah/Jumlah/Unit/Lot Total',
  },
  {
    key: 'objectLocation',
    label: 'Lokasi Objek',
  },
];

export const TableHeaderObjectAssessment: Array<TableHeader> = [
  {
    key: 'title',
    label: 'Uraian',
  },
  {
    key: 'totalMarketValue',
    label: 'Total Nilai Pasar',
  },
  {
    key: 'totalLiquidationValue',
    label: 'Total Indikasi Nilai Likuidasi',
  }
];

export const TableDataObjectAssessment = [
  {
    totalLiquidationValue: 'Total Indikasi Nilai Likuidasi',
    totalMarketValue: 'Total Nilai Pasar',
    uraian: 'Uraian',
  },
  {
    totalLiquidationValue: 'Total Indikasi Nilai Likuidasi',
    totalMarketValue: 'Total Nilai Pasar',
    uraian: 'Uraian',
  },
];

export const TableHeaderRekonsiliasi: Array<TableHeader> = [
  {
    key: 'title',
    label: 'Uraian',
  },
];

export const TableDataRekonsiliasi = [
  {
    bobot: 'Bobot',
    totalLiquidationValue: 'Indikasi Nilai Likuidasi',
    totalMarketValue: 'Nilai Pasar',
    uraian: 'Pendekatan Pendapatan',
  },
  {
    bobot: 'Bobot',
    totalLiquidationValue: 'Indikasi Nilai Likuidasi',
    totalMarketValue: 'Nilai Pasar',
    uraian: 'Pendekatan Biaya',
  },
  {
    bobot: 'Bobot',
    totalLiquidationValue: 'Indikasi Nilai Likuidasi',
    totalMarketValue: 'Nilai Pasar',
    uraian: 'Pendekatan Pasar',
  },
];
