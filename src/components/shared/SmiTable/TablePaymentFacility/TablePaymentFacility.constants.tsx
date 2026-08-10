import * as React from 'react';

import { formatCurrency } from '@/helpers/formatCurrency';
import { ellipsis } from '@/helpers/string';

import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const modal = {
  PAYMENT_FACILITY_DETAIL: 'PAYMENT_FACILITY_DETAIL',
  PAYMENT_FACILITY_FORM: 'PAYMENT_FACILITY_FORM',
  PAYMENT_FACILITY_NEW: 'PAYMENT_FACILITY_NEW',
  TABLE_PAYMENT_FACILITY_EXISTING: 'TABLEPAYMENT_FACILITY_EXISTING',
  TABLE_PAYMENT_FACILITY_EXISTING_ANNUAL_REVIEW: 'TABLEPAYMENT_FACILITY_EXISTING_ANNUAL_REVIEW',
};

export const TABLE_HEADER_LIST: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    sx: { minWidth: '4vw' },
    type: 'index',
  },
  {
    key: 'orderTypeLabel',
    label: 'Order Type',
    sx: { minWidth: '8vw' },
  },
  {
    key: 'facilityId',
    label: 'ID Fasilitas',
    sx: { minWidth: '8vw' },
  },
  {
    key: 'productLabel',
    label: 'Produk',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'totalOrderValue',
    label: 'Nominal',
    render: (row) => {
      if (Number.isFinite(row.totalOrderValue) && row.totalOrderValue > -1) {
        return React.createElement(TextStyle, { variant: 'body4' }, `IDR ${formatCurrency(String(row.totalOrderValue))}`);
      }

      // Berdasarkan tiket 7977 hanya convert IDR saja
      // if (Number.isFinite(row.totalForeignOrderValue) && row.totalForeignOrderValue > -1) {
      //   return React.createElement(TextStyle,
      //     { variant: 'body4' }, `USD ${formatCurrency(String(row.totalForeignOrderValue))}`);
      // }

      return React.createElement(TextStyle, { variant: 'body4' }, '-');
    },
    sx: { minWidth: '12vw' },
  },
  {
    key: 'projectName',
    label: 'Proyek',
    sx: { minWidth: '8vw' },
  },
  {
    key: 'valueProject',
    label: 'Nilai Proyek',
    render: (row) => {
      if (!row.projectName || !row.valueProject) return null;

      const currency = row.currencyValueProject || 'IDR';
      return React.createElement(TextStyle, { variant: 'body4' }, `${currency} ${formatCurrency(String(row.valueProject))}`);
    },
    sx: { minWidth: '8vw' },
  },
  {
    key: 'locationProjectLabel',
    label: 'Lokasi Proyek',
    sx: { minWidth: '8vw' },
  },
  {
    key: 'remark',
    label: 'Keterangan',
    render: (row) => React.createElement(TextStyle, { variant: 'body4' }, ellipsis(row.remark, 100)),
    sx: { minWidth: '10vw' },
  },
];
