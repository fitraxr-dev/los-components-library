import { formatDate, formatDateTime } from '@/helpers/date';

import TextStyle from '@/components/shared/TextStyle';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const tableHeader: Array<TableHeader> = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'pkName',
    label: 'Nama PK/Addendum',
    render: (value: string) => {
      return (
        <TextStyle variant="body4">
          {value?.pkName ? value?.pkName.split('-')[0] : '-'}
        </TextStyle>
      );
    },
    sx: {
      minWidth: '10vw',
      wordWrap: 'break-word',
    },
  },
  {
    key: 'sequence',
    label: 'Sequence',
    sx: {
      minWidth: '10vw',
      wordWrap: 'break-word',
    },
  },
  {
    key: 'pkNo',
    label: 'No. PK / No. Addendum',
    sx: {
      minWidth: '10vw',
      wordWrap: 'break-word',
    },
  },
  {
    key: 'contractType',
    label: 'Tipe Perjanjian (PK/Addendum)',
    sx: {
      minWidth: '10vw',
      wordWrap: 'break-word',
    },
  },
  {
    key: 'pkDate',
    label: 'Tanggal PK/Addendum',
    render: (value: string) => {
      return (
        <TextStyle variant="body4">
          {value?.pkDate ? formatDate(value?.pkDate) : '-'}
        </TextStyle>
      );
    },
    sx: {
      minWidth: '10vw',
      wordWrap: 'break-word',
    },
  },
  {
    key: 'effectiveDate',
    label: 'Tanggal Efektif',
    render: (value: string) => {
      return (
        <TextStyle variant="body4">
          {value?.effectiveDate ? formatDate(value?.effectiveDate) : '-'}
        </TextStyle>
      );
    },
    sx: {
      minWidth: '10vw',
      wordWrap: 'break-word',
    },
  },
  {
    key: 'description',
    label: 'Deskripsi',
    sx: {
      minWidth: '10vw',
      wordWrap: 'break-word',
    },
  },
  {
    key: 'informationDesc',
    label: 'Keterangan Deskripsi',
    sx: {
      minWidth: '10vw',
      wordWrap: 'break-word',
    },
  },
  {
    key: 'signingCondition',
    label: 'Ada Syarat Penandatanganan (Y/N)',
    render: (value: string) => {
      return (
        <TextStyle variant="body4">
          {value?.signingCondition ? 'Ya' : 'Tidak'}
        </TextStyle>
      );
    },
    sx: {
      minWidth: '10vw',
      wordWrap: 'break-word',
    },
  },
  {
    key: 'effectiveCondition',
    label: 'Ada Syarat Efektif (Y/N)',
    render: (value: string) => {
      return (
        <TextStyle variant="body4">
          {value?.effectiveCondition ? 'Ya' : 'Tidak'}
        </TextStyle>
      );
    },
    sx: {
      minWidth: '10vw',
      wordWrap: 'break-word',
    },
  },

];
