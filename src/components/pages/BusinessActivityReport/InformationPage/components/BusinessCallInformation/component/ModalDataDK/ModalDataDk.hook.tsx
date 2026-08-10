import { useState } from 'react';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useModalDataDk = () => {

  const tableHeader: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      type: 'index',
    },
    {
      key: 'debtorName',
      label: 'Nama Depan',
    },
    {
      key: 'debtorId',
      label: 'Kode',
    },
    {
      key: 'profile',
      label: 'Profil',
    },
    {
      key: 'birthPlace',
      label: 'Tempat Lahir',
    },
    {
      key: 'birthDate',
      label: 'Tanggal Lahir',
    },
    {
      key: 'nationality',
      label: 'Warga Negara',
    },
    {
      key: 'category',
      label: 'Watch List',
    },
  ];

  return {
    tableHeader,
  };
};
