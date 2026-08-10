import React from 'react';


import type { TableHeader } from '@/components/shared/Table/Table.types';


export const TABLE_HEADER: TableHeader[] = [
  {
    key: 'index',
    label: 'No',
    type: 'index',
  },
  {
    key: 'bucketMaster',
    label: 'Master ID',
    sx: {
      minWidth: '9vw',
    },
  },
  {
    key: 'bucketProcessId',
    label: 'ID',
    sx: { minWidth: '9vw' },
  },
  {
    key: 'institutionTypeLabel',
    label: 'Institution Type',
    sx: {
      minWidth: '12vw',
    },
  },
  {
    key: 'debtorName',
    label: 'Nama Customer',
    sx: { minWidth: '15vw' },
  },
  {
    key: 'division',
    label: 'Divisi',
    sx: { minWidth: '10vw' },
  },
  {
    key: 'staffName',
    label: 'Nama Staff',
    sx: { minWidth: '10vw' },
  },

];
