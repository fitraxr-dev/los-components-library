import { useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useParams, usePathname } from 'next/navigation';

import { deleteDataList, newDataList, updateDataList } from '@/__mocks__/mockDataMaster';
import { MODAL } from '@/configs/constants/modalId';
import { TypeProcess } from '@/enums/Module';
import { getLastPath, matchesPathname, replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useApp from '@/hooks/useApp';
import useViewOnly from '@/hooks/useViewOnly';

import { modal } from '../../../MasterSLA/constants';

import { TABLE_HEADER, TABLE_HEADER_UPDATE } from './HistoryListTable.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useHistoryListTable = () => {
  const [selected, setSelected] = useState([]);

  const tableHeader: Array<TableHeader> = [
    ...TABLE_HEADER,
    {
      isDisabled: () => false,
      isSelected: (data) => selected.some((el) => el.id === data.id),
      key: 'checkbox',
      label: 'Confirm',
      onSelectChange: (data) => {
        if (selected.some((el) => el.id === data.id)) {
          setSelected(selected.filter((el) => el.id !== data.id));
        } else {
          setSelected([...selected, data]);
        }
      },
      type: 'checkbox',
    },
  ];

  const tableHeaderUpdate: Array<TableHeader> = [
    ...TABLE_HEADER_UPDATE,
    {
      isDisabled: () => false,
      isSelected: (data) => selected.some((el) => el.id === data.id),
      key: 'confirm',
      label: 'Confirm',
      onSelectChange: (data) => {
        if (selected.some((el) => el.id === data.id)) {
          setSelected(selected.filter((el) => el.id !== data.id));
        } else {
          setSelected([...selected, data]);
        }
      },
    },
  ];

  const handleRejectModal = () => {
    NiceModal.show(modal.REJECT_MODAL);
  };

  const handleSubmitModal = () => {
    NiceModal.show(MODAL.GLOBAL.COMMENT);
  };

  return {
    addNewList: { contents: newDataList },
    deleteList: { contents: deleteDataList },
    handleRejectModal,
    handleSubmitModal,
    isAddNewListLoading: false,
    isDeleteLoading: false,
    isUpdateListLoading: false,
    tableHeader,
    tableHeaderUpdate,
    updateList: { contents: updateDataList },
  };
};

export default useHistoryListTable;
