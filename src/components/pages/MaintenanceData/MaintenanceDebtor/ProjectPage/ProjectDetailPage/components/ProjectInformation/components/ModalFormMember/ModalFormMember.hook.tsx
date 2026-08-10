import { useEffect, useState } from 'react';

import { useModal } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetAllDebtor from '@/hooks/services/useGetAllDebtor';
import closeNiceModal from '@/hooks/useCloseNiceModal';


import { modal } from '../../ProjectInformation.constant';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useModalFormMember = () => {
  const theme = useTheme();
  const modalId = modal.FORM_MEMBER_PROJECT;

  const [filter, setFilter] = useState('');
  const [selectedMember, setSelectedMember] = useState([]);
  const { visible } = useModal(modalId);

  const { data: debtorListData, isLoading } = useGetAllDebtor({
    page: {
      itemPerPage: 10,
      noPage: 1,
    },
    searchDetail: { key: 'md.debtor_name', value: filter },
  }, { enabled: filter?.length > 2 ? true : false });


  const handleDeleteDataGM = (data) => {
    setSelectedMember(selectedMember.filter((item) => item.debtorId !== data.debtorId));
  };

  const handleAddMember = () => {
    showNiceModalV2({
      onClose: () => {
        closeNiceModal(modalId);
      },
      title: 'Data berhasil disimpan',
      type: 'success',
    });
  };
  const tableHeader: TableHeader[] = [
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
      label: 'Nama Customer',
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'delete',
          onClick: handleDeleteDataGM,
        }
      ],
      type: 'action',
    },
  ];

  const debtorAutoCompleteList = debtorListData?.data?.contents?.map((val) => {
    return {
      id: val?.debtorId,
      label: val?.debtorName,
    };
  });

  return {
    debtorAutoCompleteList,
    debtorListData,
    filter,
    handleAddMember,
    isLoading,
    modalId,
    selectedMember,
    setFilter,
    setSelectedMember,
    tableHeader,
    theme,
    visible,
  };
};

export default useModalFormMember;
