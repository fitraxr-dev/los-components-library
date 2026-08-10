import { useEffect, useState, useCallback, useRef } from 'react';

import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import * as yup from 'yup';

import { MODAL as GLOBA_MODAL } from '@/configs/constants/modalId';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Icon from '@/components/shared/Icon';
import TextStyle from '@/components/shared/TextStyle';

import useDragAndDropUserAssigned from '../../../hooks/useDragAndDropUserAssigned';
import useGetUserByAssigned from '../../../hooks/useGetUserByAssigned';
import useSaveUserAssignedCollaboration from '../../../hooks/useSaveUserAssignedCollaboration';
import { MODAL, TABLE_HEADER_CONSENT_SHEET_CONSTANT } from '../../../RisalahRapatResult.contants';
import useRisalahRapatResult from '../../../RisalahRapatResult.hooks';

import type { onDndProps, TableHeader } from '@/components/shared/Table/Table.types';


const useConsentSheetModal = () => {

  const {
    assignmentParameter,
    processId,
    viewOnly } = useRisalahRapatResult();

  const modalId = MODAL.CONSENT_SHEET;
  const modal = useModal(modalId);
  const theme = useTheme();
  const [dataUserByAssigned, setDataUserByAssigned] = useState([]);
  const [page, setPage] = useState(1);

  const { data: getUserByAssigned, isFetched: getUserByAssignedLoading } = useGetUserByAssigned({
    bucketProcessId: processId,
    module: TypeModule.RISALAH_RAPAT,
    process: TypeProcess.RISALAH_RAPAT,
  });

  useEffect(() => {
    setDataUserByAssigned(getUserByAssigned);
  }, [getUserByAssigned]);

  const { mutate: assignUserToDivision, isPending } = useSaveUserAssignedCollaboration({
    onError: () => {
      showNiceModalV2({ title: 'Terjadi kesalahan saat menyimpan user, silahkan coba beberapa saat lagi.', type: 'error' });
    },
    onSuccess: () => {
      showNiceModalV2({ title: 'Data berhasil dihapus.', type: 'success' });
    },
  });

  const { mutate: dragAndDrop, isPending: dragAnDropIsPending } = useDragAndDropUserAssigned({
    onError: () => showNiceModalV2({ title: 'Terjadi Kesalahan', type: 'error' }),
  });

  const tableConsentDivisionHeader: TableHeader[] = [
    {
      key: '',
      label: '',
      render: () => (
        <Icon
          iconName="drag-and-drop"
          textVariant="title1"
          sx={{
            cursor: 'pointer',
            marginRight: theme.spacing(2),
            path: {
              stroke: theme.palette.common.white,
            },
          }}
        />
      ),
    },
    ...TABLE_HEADER_CONSENT_SHEET_CONSTANT,
    {
      key: 'consentRoleLabel',
      label: 'Role',
    },
    {
      key: 'sku',
      label: 'SKU',
      render: (row) => (
        <TextStyle variant="body4">
          {row.sku ? 'Ya' : 'Tidak'}
        </TextStyle>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'edit', onClick: (data) => handleEditPenandatangan(data),
        },
        {
          iconName: 'delete', onClick: (data) => handleDeletePenandatangan(data),
        }],
      type: 'action',
    }
  ];

  const handleOnDragAndDrop = (data: onDndProps, index: number) => {
    const { previousItem, nextItem, currentItem, currentIndex, newTableData } = data;

    dragAndDrop({
      id: currentItem.id,
      nextSequence: nextItem?.sequence ?? null,
      previousSequence: previousItem?.sequence ?? null,
    });

    if (previousItem === null) {
      currentItem.sequence = nextItem?.sequence - 512;
    } else if (nextItem === null) {
      currentItem.sequence = previousItem?.sequence + 512;
    } else {
      currentItem.sequence = (previousItem?.sequence + nextItem?.sequence) / 2;
    }

    const array = [...dataUserByAssigned];
    array[index].data = [...newTableData];
    array[index].data[currentIndex] = currentItem;
    setDataUserByAssigned(array);
  };

  const handleTableData = (result: any, index: number) => {
    const array = [...dataUserByAssigned];
    array[index].data = result;
    setDataUserByAssigned(array);
  };

  const handleAddPenandatangan = (dt: { value: string; key: string }) => {
    NiceModal.show(MODAL.SIGNATORY, { assignedTo: dt.key, id: null });
  };

  const handleEditPenandatangan = (data: { id: number }) => {
    NiceModal.show(MODAL.SIGNATORY, { id: data.id, mode: 'Edit' });
  };

  const handleDeletePenandatangan = (data: { id: number }) => {
    showNiceModalV2({
      cancelText: 'Tidak', onSubmit: () => {
        assignUserToDivision({
          assignedTo: null,
          id: data.id,
        });
      }, submitText: 'Iya', title: 'Apakah anda yakin ingin menghapus data?', type: 'warning',
    });
  };

  const handleCloseConsentSheet = () => {
    closeNiceModal(modalId);
  };


  return {
    assignmentParameter,
    dataUserByAssigned,
    dragAnDropIsPending,
    getUserByAssigned,
    getUserByAssignedLoading,
    handleAddPenandatangan,
    handleCloseConsentSheet,
    handleOnDragAndDrop,
    handleTableData,
    isPending,
    modal,
    page,
    setPage,
    tableConsentDivisionHeader,
    theme,
    viewOnly,
  };
};

export default useConsentSheetModal;
