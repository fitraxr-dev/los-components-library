import { useState } from 'react';

import { useForm } from 'react-hook-form';

import { TABLE_HEADER as TablePlace } from './AddendumData.constants';

import type { TableHeader as TableType } from '@/components/shared/Table/Table.types';


const useAddendumData = () => {
  const [checkData, setCheckData] = useState([]);

  const { setValue, getValues, watch } = useForm({});

  const TABLE_HEADER: TableType[] = [
    ...TablePlace,
    {
      isDisabled: () => false,
      isSelected: (data) => checkData.some((item) => item.id === data.id),
      key: 'checkbox',
      label: 'Confirm',
      sx: { width: '4%' },
      type: 'checkbox',
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        { iconName: 'detail', onClick: () => { } },
        { iconName: 'download', onClick: () => { } },
      ],
      type: 'action',
    },
  ];

  return {
    TABLE_HEADER,
    getValues, setValue, watch,
  };
};

export default useAddendumData;
