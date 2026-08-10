import { toDateString } from '@/helpers/date';
import { formatCurrency } from '@/helpers/formatCurrency';

import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_PAYMENT_FACILITY_EXISTING: Array<TableHeader> = [
  {
    key: 'id',
    label: 'No',
    type: 'index',
  },
  {
    key: 'facilityId',
    label: 'ID Fasilitas',
  },
  {
    key: 'financingSegmentLabel',
    label: 'Segmen Pembiayaan',
  },
  {
    key: 'productLabel',
    label: 'Produk',
  },
  {
    key: 'totalOrderValue',
    label: 'Plafond',
    render: (data) => (
      <TextStyle>IDR {(data.totalOrderValue === null || data.totalOrderValue === undefined || data.totalOrderValue === '' || data.totalOrderValue < 0) ? '-' : formatCurrency(data.totalOrderValue.toString())}</TextStyle>
    ),
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'outstanding',
    label: 'O/S',
  },
  {
    key: 'projectName',
    label: 'Proyek',
  },
  {
    key: 'exchangeRate',
    label: 'Rate',
  },
  {
    key: 'locationProjectLabel',
    label: 'Lokasi Proyek',
  },
  {
    key: 'collectivity',
    label: 'Kolektibilitas',
  },
];
