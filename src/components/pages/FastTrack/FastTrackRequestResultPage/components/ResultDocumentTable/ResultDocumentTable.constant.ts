import * as React from 'react';

import Icon from '@/components/shared/Icon';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_HEADER: TableHeader[] = [
  {
    key: '',
    label: '',
    render: () => React.createElement(
      Icon,
      {
        iconName: 'drag-and-drop',
        sx: { '&:active': { cursor: 'grabbing' }, cursor: 'grab', marginRight: 2, path: { stroke: 'common.white' } },
        textVariant: 'body4',
      }
    ),
  },
  {
    key: 'index',
    label: 'No',
    sx: {
      minWidth: '4vw',
    },
    type: 'index',
  },
  {
    key: 'documentCategoryLabel',
    label: 'Kategori Dokumen',
    sx: {
      minWidth: '10vw',
    },
  },
  {
    key: 'documentGroupLabel',
    label: 'Group Dokumen',
    sx: {
      minWidth: '15vw',
    },
  },
  {
    key: 'documentTypeLabel',
    label: 'Jenis Dokumen',
    sx: {
      minWidth: '15vw',
    },
  },
  {
    key: 'documentName',
    label: 'Nama Dokumen',
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'fileName',
    label: 'Upload Dokumen',
    sx: {
      minWidth: '15vw',
    },
  },
  {
    key: 'documentNumber',
    label: 'Nomor Dokumen',
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'documentDate',
    label: 'Tanggal Dokumen',
    sx: {
      minWidth: '12vw',
    },
  },
];
