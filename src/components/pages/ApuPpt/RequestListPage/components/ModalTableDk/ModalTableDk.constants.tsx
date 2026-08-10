import ColumnWrapper from '@/components/shared/ColumnWrapper';
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
    key: 'debtorName',
    label: 'Nama Depan',
    render: (row) => (
      <TextStyle variant="body4" textAlign="center" >
        {row.debtorName ? row?.debtorName : '-'}
      </TextStyle>
    ),
    sx: {
      minWidth: '8vw',
    },
  },
  {
    key: 'debtorId',
    label: 'Kode',
    render: (row) => (
      <TextStyle variant="body4" textAlign="center" >
        {row.debtorId ? row?.debtorId : '-'}
      </TextStyle>
    ),
    sx: {
      minWidth: '6vw',
    },
  },
  {
    key: 'profile',
    label: 'Profil',
    render: (row) => (
      <TextStyle variant="body4" textAlign="center" >
        {row.profile ? row?.profile : '-'}
      </TextStyle>
    ),
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'birthPlace',
    label: 'Tempat Lahir',
    render: (row) => (
      <TextStyle variant="body4" textAlign="center" >
        {row.birthPlace ? row?.birthPlace : '-'}
      </TextStyle>
    ),
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'birthDate',
    label: 'Tanggal Lahir',
    sx: {
      minWidth: '13vw',
    },
    type: 'date',

  },
  {
    key: 'nationality',
    label: 'Warga Negara',
    render: (row) => (
      <TextStyle variant="body4" textAlign="center" >
        {row.nationality ? row?.nationality : '-'}
      </TextStyle>
    ),
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'category',
    label: 'Watchlist',
    render: (row) => (
      <TextStyle variant="body4" textAlign="center" >
        {row.category ? row?.category : '-'}
      </TextStyle>
    ),
    sx: {
      minWidth: '10vw',
    },
  }
];
