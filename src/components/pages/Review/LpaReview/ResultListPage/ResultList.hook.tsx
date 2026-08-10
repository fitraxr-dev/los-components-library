import { useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { lpaReview } from '@/configs/constants/pathname';
import { replacePath } from '@/helpers/navigation';
import useCustomRouter from '@/hooks/useCustomRouter';

import Label from '../../components/Label';

import { tableHeaderResultList } from './ResultList.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const validationSchema = yup.object({
  list: yup.array(),
});

const initialValue = {
  list: [],
};

export const useResultList = () => {
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const router = useCustomRouter();

  const handleToDetailPage = (id: string) => {
    router.push(replacePath(lpaReview.DEBTOR_INFORMATION, { module: 'result', processId: id }));
  };


  const { watch, setValue } = useForm({
    defaultValues: initialValue,
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  });

  const tableHeader: Array<TableHeader> = [
    {
      isDisabled: () => false,
      isSelected: (data) => watch('list')?.some((item) => item.id === data.id),
      key: 'checkbox',
      onSelectChange: (data) => {
        if (watch('list')?.some((item) => item.id === data.id)) {
          setValue('list', watch('list').filter((item) => item.id !== data.id));
        } else {
          setValue('list', [...watch('list'), data]);
        }
      },
      type: 'checkbox',
    },
    ...tableHeaderResultList,
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Label text={row.statusLabel} />
      ),
      sx: { minWidth: '12vw' },
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (data) => handleToDetailPage(data.id),
        },
      ],
      sx: {
        minWidth: '6vw',
        textAlign: 'center',
      },
      type: 'action',
    },
  ];

  return {
    handleToDetailPage,
    noPage,
    setItemPerPage,
    setNoPage,
    tableHeader,
  };
};
