import * as yup from 'yup';

import { toDateString } from '@/helpers/date';

import TextStyle from '@/components/shared/TextStyle';

import useCollateralDetail from './CollateralDetail.hook';

import type { TableHeader } from '@/components/shared/Table/Table.types';

// Validation schema for CollateralDetail form
export const collateralDetailValidation = yup.object().shape({
  assesmentObject: yup.string().notRequired(),
  bucketProcessId: yup.string().notRequired(),
  buildingTypeOtherRemark: yup.string().when(['buildingTypeRemark', 'propertyTypeRemark'], {
    is: (buildingTypeRemark: string, propertyTypeRemark: string) =>
      buildingTypeRemark === 'OTHERS' || propertyTypeRemark === 'OTHERS',
    otherwise: (schema) => schema.notRequired(),
    then: (schema) => schema.required('Lainnya wajib diisi'),
  }),
  buildingTypeRemark: yup.string().notRequired(),
  coordinate: yup.string().notRequired(),
  description: yup.string().notRequired(),
  detailLocation: yup.string().notRequired(),
  document: yup.mixed().notRequired(),
  id: yup.string().notRequired(),
  indicationLiquidationCurrencyCode: yup.string().notRequired(),
  indicationLiquidationFxRateSource: yup.string().notRequired(),
  indicationLiquidationFxRateToIdr: yup.string().notRequired(),
  indicationLiquidationIdr: yup.string().notRequired(),
  indicationLiquidationValue: yup.string().notRequired(),
  marketValue: yup.string().notRequired(),
  marketValueCurrencyCode: yup.string().notRequired(),
  marketValueFxRateSource: yup.string().notRequired(),
  marketValueFxRateToIdr: yup.string().notRequired(),
  marketValueIdr: yup.string().notRequired(),
  module: yup.string().notRequired(),
  objectLocation: yup.string().notRequired(),
  process: yup.string().notRequired(),
  proofOwnership: yup.string().notRequired(),
  propertyTypeRemark: yup.string().notRequired(),
  readonly: yup.boolean().notRequired(),
  type: yup.string().notRequired(),
});

export enum mods {
  BOAT = 'BOAT',
  BUILDING = 'BUILDING',
  BUSINESS = 'BUSINESS',
  COMPLEMENTARY_FACILITIES = 'COMPLEMENTARY_FACILITIES',
  INVENTORY = 'INVENTORY',
  LAND = 'LAND',
  LAND_BUILDING = 'LAND_BUILDING',
  MACHINES_EQUIPMENT = 'MACHINES_EQUIPMENT',
  MOVING_ASSETS = 'MOVING_ASSETS',
  VEHICLES = 'VEHICLES',
};

export const type = {
  BOAT: 'BOAT',
  BUILDING: 'BUILDING',
  BUSINESS: 'BUSINESS',
  COMPLEMENTARY_FACILITIES: 'COMPLEMENTARY_FACILITIES',
  INVENTORY: 'INVENTORY',
  LAND: 'LAND',
  LAND_BUILDING: 'LAND_BUILDING',
  MACHINES_EQUIPMENT: 'MACHINES_EQUIPMENT',
  MOVING_ASSETS: 'MOVING_ASSETS',
  VEHICLES: 'VEHICLES',
};

export const label = {
  BOAT: 'Kapal',
  BUILDING: 'Bangunan',
  BUSINESS: 'Bisnis',
  COMPLEMENTARY_FACILITIES: 'Sarana Pelengkap',
  INVENTORY: 'Inventory',
  LAND: 'Tanah',
  LAND_BUILDING: 'Tanah & Bangunan',
  MACHINES_EQUIPMENT: 'Mesin & Peralatan',
  MOVING_ASSETS: 'Asset Bergerak',
  VEHICLES: 'Kendaraan',
};

export const modal = {
  BOAT: 'MODAL_BOAT',
  BUILDING: 'MODAL_BUILDING',
  BUSINESS: 'MODAL_BUSINESS',
  COMPLEMENTARY_FACILITIES: 'MODAL_COMPLEMENTARY_FACILITIES',
  INVENTORY: 'MODAL_INVENTORY',
  LAND: 'MODAL_LAND',
  LAND_BUILDING: 'MODAL_LAND_BUILDING',
  MACHINES_EQUIPMENT: 'MODAL_MACHINES_EQUIPMENT',
  MOVING_ASSETS: 'MODAL_MOVING_ASSETS',
  VEHICLES: 'MODAL_VEHICLES',
};

export const TABLEHEADERLAND: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'documentTypeLabel',
    label: 'Jenis Dokumen',
  },
  {
    key: 'documentNo',
    label: 'Nomor Dokumen',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'rightsHolders',
    label: 'Pemegang Hak',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'publicationDate',
    label: 'Tanggal Penerbitan',
    render: (row) => <TextStyle variant="body4">{row.publicationDate ? toDateString(row.publicationDate) : '-'}</TextStyle>,
    sx: { minWidth: '10vw' },
  },
  {
    key: 'endDate',
    label: 'Tanggal Berakhir',
    render: (row) => <TextStyle variant="body4">{row.endDate ? toDateString(row.endDate) : '-'}</TextStyle>,
    sx: { minWidth: '10vw' },
  },
  {
    key: 'measuringLetterNo',
    label: 'No Surat Ukur',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'measuringLetterDate',
    label: 'Tanggal Surat ukur',
    render: (row) => <TextStyle variant="body4">{row.measuringLetterDate ? toDateString(row.measuringLetterDate) : '-'}</TextStyle>,
    sx: { minWidth: '10vw' },
  },
  {
    key: 'wide',
    label: 'Luas(m2)',
  },
  {
    key: 'indicationLiquidationValue',
    label: 'Indikasi Nilai Likuidasi',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'marketValue',
    label: 'Nilai Pasar',
    sx: { minWidth: '10vw' },
  },
];

export const TABLEHEADERBUILDING: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'name',
    label: 'Nama',
  },
  {
    key: 'imbNumber',
    label: 'Nomor IMB',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'imbDate',
    label: 'Tanggal IMB',
    render: (row) => <TextStyle variant="body4">{row.imbDate ? toDateString(row.imbDate) : '-'}</TextStyle>,
    sx: { minWidth: '10vw' },
  },
  {
    key: 'condition',
    label: 'Kondisi',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'builtYear',
    label: 'Tahun Dibangun/Renovasi',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'wide',
    label: 'Luas(m2)',
  },
  {
    key: 'allotment',
    label: 'Peruntukan',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'indicationLiquidationValue',
    label: 'Indikasi Nilai Likuidasi',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'marketValue',
    label: 'Nilai Pasar',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'remark',
    label: 'Keterangan',
    sx: { minWidth: '10vw' },
  },
];

export const TABLEHEADERMACHINE: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'number',
    label: 'Nomor Mesin',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'spesification',
    label: 'Spesifikasi',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'amount',
    label: 'Jumlah',
  },
  {
    key: 'year',
    label: 'Tahun',
  },
  {
    key: 'condition',
    label: 'Kondisi',
  },
  {
    key: 'indicationLiquidationValue',
    label: 'Indikasi Nilai Likuidasi',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'marketValue',
    label: 'Nilai Pasar',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'remark',
    label: 'Keterangan',
    sx: { minWidth: '10vw' },
  },
];

export const TABLEHEADERUTILITY: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'name',
    label: 'Nama',
  },
  {
    key: 'year',
    label: 'Tahun',
  },
  {
    key: 'condition',
    label: 'Kondisi',
  },
  {
    key: 'indicationLiquidationValue',
    label: 'Indikasi Nilai Likuidasi',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'marketValue',
    label: 'Nilai Pasar',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'remark',
    label: 'Keterangan',
    sx: { minWidth: '10vw' },
  },
];

export const TABLEHEADERSHIP: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'name',
    label: 'Nama',
  },
  {
    key: 'condition',
    label: 'Kondisi',
  },
  {
    key: 'indicationLiquidationValue',
    label: 'Indikasi Nilai Likuidasi',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'marketValue',
    label: 'Nilai Pasar',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'countryManufacture',
    label: 'Negara Pembuat',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'year',
    label: 'Tahun',
  },
  {
    key: 'imoNo',
    label: 'No IMO',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'deadWeight',
    label: 'Bobot Mati',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'mainEngine',
    label: 'Mesin Utama',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'flag',
    label: 'Bendera',
  },
  {
    key: 'netWeight',
    label: 'Berat Bersih',
    sx: { minWidth: '10vw' },
  },
];

export const TABLEHEADERINVENTORY: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'name',
    label: 'Nama',
  },
  {
    key: 'amount',
    label: 'Jumlah',
  },
  {
    key: 'condition',
    label: 'Kondisi',
  },
  {
    key: 'indicationLiquidationValue',
    label: 'Indikasi Nilai Likuidasi',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'marketValue',
    label: 'Nilai Pasar',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'remark',
    label: 'Keterangan',
    sx: { minWidth: '10vw' },
  },
];

export const TABLEHEADERVEHICLE: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'name',
    label: 'Nama',
  },
  {
    key: 'year',
    label: 'Tahun',
  },
  {
    key: 'condition',
    label: 'Kondisi',
  },
  {
    key: 'indicationLiquidationValue',
    label: 'Indikasi Nilai Likuidasi',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'marketValue',
    label: 'Nilai Pasar',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'bpkbNumber',
    label: 'No BPKB',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'policeNumber',
    label: 'No Polisi',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'engineNumber',
    label: 'No Mesin',
    sx: { minWidth: '10vw' },
  },
];
