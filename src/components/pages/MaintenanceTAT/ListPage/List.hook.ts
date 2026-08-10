import { useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { LIST_DATA } from './__mocks__/mockData';
import { modal } from './List.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useList = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [isConfirmEdit, setIsConfirmEdit] = useState(false);

  const TABLE_HEADER_MAINTENANCE_TAT: Array<TableHeader> = [
    {
      key: 'index',
      label: 'No',
      type: 'index',
    },
    {
      key: 'feature',
      label: 'Fitur',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'endOfDayDefault',
      label: 'End Of Day Default',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'extraEndOfDay',
      label: 'Extra End Of Day',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'active',
      label: 'Active',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: isEdit ? 'edit' : 'detail',
          onClick: (data) => {
            if (isEdit) {
              NiceModal.show(modal.EDIT_MODAL, { endOfDay: data.endOfDayDefault, title: 'Edit  Turn Around Time (TAT)' });
            } else {
              NiceModal.show(modal.DETAIL_MODAL, { data: createDetailObject(data), title: 'Detail  Turn Around Time (TAT)' });
            }
          },
        },
      ],
      sx: { minWidth: '10vw' },
      type: 'action',
    },
  ];

  const createDetailObject = (data) => {
    return [
      {
        label: 'End Of Day',
        value: data.endOfDayDefault,
      },
      {
        label: 'Active',
        value: data.active,
      },
      {
        label: 'Need Extra',
        value: data.extraEndOfDay ? 'Ya' : 'Tidak',
      },
      {
        label: 'Extra End Of Day',
        value: data.extraEndOfDay,
      },
    ];
  };

  return {
    LIST_DATA,
    TABLE_HEADER_MAINTENANCE_TAT,
    isConfirmEdit,
    isEdit,
    setIsConfirmEdit,
    setIsEdit,
  };
};

export default useList;
