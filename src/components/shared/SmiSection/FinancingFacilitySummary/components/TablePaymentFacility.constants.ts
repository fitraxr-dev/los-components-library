import type { TableHeader } from '@/components/shared/Table/Table.types';


export const modal = {
  PAYMENT_FACILITY_DETAIL: 'PAYMENT_FACILITY_DETAIL',
  PAYMENT_FACILITY_FORM: 'PAYMENT_FACILITY_FORM',
  PAYMENT_FACILITY_NEW: 'PAYMENT_FACILITY_NEW',
  TABLE_PAYMENT_FACILITY_EXISTING: 'TABLEPAYMENT_FACILITY_EXISTING',
};

export const TABLE_HEADER_LIST: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'orderTypeLabel',
    label: 'Order Type',
    sx: {
      minWidth: '8vw',
    },
  },
  {
    key: 'facilityId',
    label: 'ID Fasilitas',
    sx: {
      minWidth: '8vw',
    },
  },
  {
    key: 'productLabel',
    label: 'Produk',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'orderValue',
    label: 'Nominal',
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'timePeriod',
    label: 'Jangka Waktu',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'projectName',
    label: 'Proyek',
    sx: {
      minWidth: '8vw',
    },
  },
  {
    key: 'valueProject',
    label: 'Nilai Proyek',
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'locationProjectLabel',
    label: 'Lokasi Proyek',
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'remark',
    label: 'Keterangan',
    sx: {
      minWidth: '8vw',
    },
  }];
