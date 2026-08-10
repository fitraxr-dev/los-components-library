import { toDateString } from '@/helpers/date';
import { formatCurrency } from '@/helpers/formatCurrency';

import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const tableHeaderList: Array<TableHeader> = [
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
      minWidth: '8vw',
    },
  },
  {
    key: 'totalOrderValue',
    label: 'Nominal',
    render: (data) => (
      <TextStyle>IDR {(data.totalOrderValue === null || data.totalOrderValue === undefined || data.totalOrderValue === '' || data.totalOrderValue < 0) ? '-' : formatCurrency(data.totalOrderValue.toString())}</TextStyle>
    ),
    sx: {
      minWidth: '10vw',
    },
  },
  // {
  //   key: 'timePeriod',
  //   label: 'Jangka Waktu',
  //   sx: {
  //     minWidth: '8vw',
  //   },
  // },
  {
    key: 'pkName',
    label: 'Nama PK/Addendum',
    render: (row) => {
      const pkName = row?.pkName?.split('-')[0] ?? '-';
      return <TextStyle variant="body4">{pkName}</TextStyle>;
    },
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'pkNumber',
    label: 'No PK/Addendum',
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'pkDate',
    label: 'Tanggal PK/Addendum',
    render: (data) => {
      if (!data.pkDate) return <TextStyle variant="body4">-</TextStyle>;
      const [day, month, year] = data.pkDate.split('-');
      return <TextStyle variant="body4">{toDateString(`${year}-${month}-${day}`)}</TextStyle>;
    },
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'annualReviewDate',
    label: 'Latest Annual Review',
    render: (data) => {
      if (!data.annualReviewDate) return <TextStyle variant="body4">-</TextStyle>;
      const [day, month, year] = data.annualReviewDate.split('-');
      return <TextStyle variant="body4">{toDateString(`${year}-${month}-${day}`)}</TextStyle>;
    },
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'projectName',
    label: 'Proyek',
    sx: {
      minWidth: '8vw',
    },
  },
];
