import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TableHeaderList: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    sx: { minWidth: '6vw' },
    type: 'index',
  },
  {
    key: 'applicationNo',
    label: 'Application No.',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'facilityId',
    label: 'Facility ID',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'facilityNo',
    label: 'Facility No',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'financingType',
    label: 'Financing Type',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'productType',
    label: 'Product Type',
    sx: { minWidth: '10vw' },
  },
  // {
  //   key: 'idLimit',
  //   label: 'ID Limit',
  //   sx: { minWidth: '10vw' },
  // }
];

export const TableHeaderListSyariah: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    sx: { minWidth: '6vw' },
    type: 'index',
  },
  {
    key: 'parentFacilityNo',
    label: 'Kode Induk',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'parentLimitId',
    label: 'Fasilitas Induk ID',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'childFacilityCode',
    label: 'Kode Anak',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'childFacilityCoreId',
    label: 'Fasilitas Anak ID',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'productType',
    label: 'Product',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'syariahContract',
    label: 'Akad',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'financingType',
    label: 'Financing Type',
    sx: { minWidth: '10vw' },
  },
];
