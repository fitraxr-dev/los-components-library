import * as React from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useShallow } from 'zustand/react/shallow';

import { MODAL } from '@/configs/constants/modalId';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useViewOnly from '@/hooks/useViewOnly';

import Icon from '@/components/shared/Icon';

import useModalConsentSheetStore from '../../Modals/ModalConsentSheet/ModalConsentSheet.store';

import { TABLE_HEADER } from './TableConsentSheetUser.constant';

import type { TableHeader } from '@/components/shared/DndTable/DndTable.types';
import type { DragEndEvent } from '@dnd-kit/core';


const useTableConsentSheetUser = (sectionId: string) => {
  const { viewOnly } = useViewOnly();
  const { reorderUser, deleteUser } = useModalConsentSheetStore(
    useShallow((state) => ({
      deleteUser: state.deleteUser,
      reorderUser: state.reorderUser,
    }))
  );

  const handleOnDragEnd = React.useCallback(({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    reorderUser(sectionId, active.id, over.id);
  }, [reorderUser, sectionId]);

  const handleAddUser = React.useCallback(() => {
    NiceModal.show(MODAL.RISALAH_RAPAT.CONSENT_SHEET_USER, { sectionId });
  }, [sectionId]);

  const handleEditUser = React.useCallback((data) => {
    NiceModal.show(MODAL.RISALAH_RAPAT.CONSENT_SHEET_USER, { id: data?.id, sectionId, user: data });
  }, [sectionId]);

  const handleDeleteUser = React.useCallback((data) => {
    const userId = data?.localId;

    showNiceModalV2({
      onSubmit: () => {
        try {
          deleteUser(sectionId, userId);
          showNiceModalV2({ title: 'User berhasil dihapus', type: 'success' });
        } catch {
          showNiceModalV2({ title: 'Gagal menghapus user', type: 'error' });
        }
      },
      submitText: 'Ya',
      title: 'Apakah Anda yakin ingin menghapus user ini?',
      type: 'warning',
    });
  }, [sectionId]);

  const tableHeader: TableHeader[] = React.useMemo(() => {
    return [
      ...(!viewOnly ? [
        {
          key: '',
          label: '',
          render: () => React.createElement(
            Icon,
            {
              iconName: 'drag-and-drop',
              sx: { '&:active': { cursor: 'grabbing' }, cursor: 'grab', marginRight: 1, path: { stroke: 'common.white' } },
              textVariant: 'body4',
            }
          ),
        }
      ] : []),
      ...TABLE_HEADER,
      {
        key: 'action',
        label: 'Action',
        options: [
          {
            iconName: 'edit',
            isDisabled: viewOnly,
            onClick: handleEditUser,
          },
          {
            iconName: 'delete',
            isDisabled: viewOnly,
            onClick: handleDeleteUser,
          }
        ],
        type: 'action',
      }
    ];
  }, [handleEditUser, handleDeleteUser, viewOnly]);

  return {
    handleAddUser,
    handleOnDragEnd,
    tableHeader,
  };
};

export default useTableConsentSheetUser;
