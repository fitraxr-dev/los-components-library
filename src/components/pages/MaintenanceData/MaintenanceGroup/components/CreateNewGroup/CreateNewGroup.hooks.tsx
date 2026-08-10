import { useState } from 'react';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useCreateNewGroupModal = () => {

  // mock data table | dummy data
  const listData = {
    data: {
      contents: [
        {
          idGroup: 'MK-2',
          jenisGroup: 'BUMN',
          nameGroup: 'Akatsuki',
          sektorIndustri: 'Sektor Industri 1',
        },
        {
          idGroup: 'MK-2',
          jenisGroup: 'BUMN',
          nameGroup: 'Akatsuki',
          sektorIndustri: 'Sektor Industri 1',
        }
      ],
      page: {},
    },
  };

  const tableHeader: TableHeader[] = [
    {
      isDisabled: () => false,
      isSelected: () => false,
      key: 'checkbox',
      onSelectChange: () => { },
      type: 'checkbox',
    },
    {
      key: 'index',
      label: 'No',
      type: 'index',
    },
    {
      key: 'idGroup',
      label: 'ID Group',
    },
    {
      key: 'nameGroup',
      label: 'Nama Group',

    },
    {
      key: 'jenisGroup',
      label: 'Jenis Group',
    },
    {
      key: 'sektorIndustri',
      label: 'Sektor Industri',
    }
  ];


  return {
    listData,
    tableHeader,

  };
};

export default useCreateNewGroupModal;
