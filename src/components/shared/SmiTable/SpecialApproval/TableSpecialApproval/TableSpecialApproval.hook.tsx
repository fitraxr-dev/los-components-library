import { useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import showNiceModal from '@/helpers/showNiceModal';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import TextStyle from '@/components/shared/TextStyle';

import useDeleteSpecialApproval from './hooks/useDeleteManagement';
import useGetSpecialApproval from './hooks/useGetSpecialApproval';
import { modal } from './TableSpecialApproval.constants';

import type { TableSpecialApprovalProps } from './TableSpecialApproval.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useTableSpecialApproval = ({ module, process }: TableSpecialApprovalProps) => {
  const theme = useTheme();
  const { viewOnly } = useViewOnly();
  const { processId } = useIdentity();

  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);

  const { data } = useGetSpecialApproval({
    filter: {
      bucketProcessId: processId,
      module: module,
      process: process,
      type: 'NON_OTHERS',
    },
    page: {
      itemPerPage: itemPerPage,
      noPage: noPage,
    },
    sortList: {
      columnName: 'modifiedDate',
      sortType: 'DESC',
    },
  });

  const { isPending: isDeleteLoading, mutate: deleteData } = useDeleteSpecialApproval({
    onSuccess: () => showNiceModalV2({ type: 'success' }),
  });

  const dataList = data?.contents.map((dt) => ({
    bucketProcessId: dt.bucketProcessId,
    description: dt.description,
    id: dt.id,
    specialNote: dt.specialNote,
    tableSpecialApprovalType: dt.typeSpecialApproval === 'OTHERS' ? dt.specialNote : dt.typeSpecialApprovalLabel,
    type: dt.type,
    typeSpecialApproval: dt.typeSpecialApproval,
    typeSpecialApprovalLabel: dt.typeSpecialApprovalLabel,
    viewOnly: dt.viewOnly,
  }));

  const tableHeader: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      type: 'index',
    },
    {
      key: 'tableSpecialApprovalType',
      label: 'Jenis Persetujuan Khusus',
      sx: { width: '25%' },
    },
    {
      key: 'description',
      label: 'Deskripsi',
      render: (data) => (
        <TextStyle
          variant="body4"
          sx={{
            display: 'block',
            maxWidth: '25vw',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {data.description ?? '-'}
        </TextStyle>
      ),
      sx: { width: '60%' },

    },
    {
      key: 'action',
      label: 'Action',
      options: [
        { iconName: 'detail', onClick: (props) => handpeOpenSpecialApprovalDetailPopup('NON_OTHERS', props) },
        {
          iconName: 'edit',
          isDisabled: viewOnly,
          onClick: (props) => handpeOpenSpecialApprovalPopup(props),
        },
        { iconName: 'delete', isDisabled: isDeleteLoading || viewOnly, onClick: (props) => onDeleteHandler(props.id) },
      ],
      type: 'action',
    },
  ];

  const handpeOpenSpecialApprovalPopup = (values?: any) => {
    NiceModal.show(modal.SPECIAL_APPROVAL, {
      initialValues: values,
      module,
      process,
    });
  };
  const handpeOpenSpecialApprovalDetailPopup = (type: 'OTHERS' | 'NON_OTHERS', values?: any) => {
    NiceModal.show(modal.SPECIAL_APPROVAL_DETAIL, {
      initialValues: values,
      type,
    });
  };

  const onDeleteHandler = (id: number) => {
    showNiceModal('confirm', 'Apakah anda yakin untuk Menghapus data Persetujuan Khusus ini?', () => deleteData({ id }), 'Tidak', 'Ya');
  };

  return {
    data,
    dataList,
    handpeOpenSpecialApprovalPopup,
    noPage,
    setItemPerPage,
    setNoPage,
    tableHeader,
    theme,
    viewOnly,
  };
};
