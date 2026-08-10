import * as React from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useShallow } from 'zustand/react/shallow';

import { MODAL } from '@/configs/constants/modalId';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import useGetConsentSheetList from '../../../hooks/useGetConsentSheetList';
import useSaveConsentSheetList from '../../../hooks/useSaveConsentSheetList';

import useModalConsentSheetStore from './ModalConsentSheet.store';

import type { DragEndEvent } from '@dnd-kit/core';


const useModalConsentSheet = () => {
  const { processId } = useIdentity();
  const { viewOnly } = useViewOnly();


  const {
    consentSheetSections,
    deleteSection,
    hydrateSections,
    reorderSection,
    reset,
  } = useModalConsentSheetStore(
    useShallow((state) => ({
      consentSheetSections: state.consentSheetSections,
      deleteSection: state.deleteSection,
      hydrateSections: state.hydrateSections,
      reorderSection: state.reorderSection,
      reset: state.reset,
    }))
  );

  const { data: consentSheetData, isLoading: isConsentSheetLoading } = useGetConsentSheetList({
    bucketProcessId: processId,
  }, {
    select: (data) => {
      const sections = data?.content?.listDivision ?? [];
      const sortedData = [...sections]
        .sort((a, b) => a.sequence - b.sequence)
        .map((sec) => ({
          ...sec,
          listUser: (sec.listUser ?? [])
            .sort((a, b) => a.sequence - b.sequence),
        }));

      return sortedData;
    },
  });

  React.useEffect(() => {
    if (!consentSheetData?.length) {
      reset();
      return;
    }

    hydrateSections(consentSheetData);
  }, [consentSheetData, hydrateSections, processId, reset]);

  const consentSheetIds = React.useMemo(() => (
    consentSheetSections.map((item) => item.localId)
  ), [consentSheetSections]);

  const handleOnDragEnd = React.useCallback(({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    reorderSection(active.id, over.id);
  }, [reorderSection]);

  const { mutate: saveConsentSheet, isPending: isSaveConsentSheetLoading } = useSaveConsentSheetList({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      closeNiceModal(MODAL.RISALAH_RAPAT.CONSENT_SHEET_LIST);
      showNiceModalV2({
        title: 'Data berhasil disimpan.',
        type: 'success',
      });
    },
  });

  const handleSave = React.useCallback(() => {
    const sections = consentSheetSections.map((section, index) => {
      const { localId: _sectionLocalId, listUser = [], ...restSection } = section;
      const formattedUsers = listUser.map((user, userIndex) => {
        const { localId: _userLocalId, ...restUser } = user;
        return {
          ...restUser,
          sequence: userIndex + 1,
        };
      });

      return {
        ...restSection,
        listUser: formattedUsers,
        sequence: index + 1,
      };
    });

    saveConsentSheet({
      bucketProcessId: processId,
      listDivision: sections,
    });
  }, [consentSheetSections, processId, saveConsentSheet]);

  const handleAddNewSection = React.useCallback(() => {
    NiceModal.show(MODAL.RISALAH_RAPAT.CONSENT_SHEET_SECTION);
  }, []);

  const handleEditSection = React.useCallback((sectionId) => {
    NiceModal.show(MODAL.RISALAH_RAPAT.CONSENT_SHEET_SECTION, { sectionId });
  }, []);

  const handleDeleteSection = React.useCallback((sectionId: string) => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => deleteSection(sectionId),
      submitText: 'Ya',
      title: 'Apakah Anda yakin ingin menghapus section ini?',
      type: 'warning',
    });
  }, [deleteSection]);


  const autoSavePayload = React.useMemo(() => () => {
    const sections = consentSheetSections.map((section, index) => {
      const { localId: _sectionLocalId, listUser = [], ...restSection } = section;
      const formattedUsers = listUser.map((user, userIndex) => {
        const { localId: _userLocalId, ...restUser } = user;
        return {
          ...restUser,
          sequence: userIndex + 1,
        };
      });

      return {
        ...restSection,
        listUser: formattedUsers,
        sequence: index + 1,
      };
    });

    return Promise.resolve({
      bucketProcessId: processId,
      listDivision: sections,
      module: TypeModule.RISALAH_RAPAT,
      process: TypeProcess.RISALAH_RAPAT,
    });
  }, [consentSheetSections, processId]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: !viewOnly,
    payload: autoSavePayload,
    url: 'agreement.risalahRapatConsentSheet.saveList',
  });

  return {
    consentSheetIds,
    consentSheetSections,
    handleAddNewSection,
    handleDeleteSection,
    handleEditSection,
    handleOnDragEnd,
    handleSave,
    isAutoSaveFetching,
    isLoading: isConsentSheetLoading || isSaveConsentSheetLoading,
  };
};

export default useModalConsentSheet;
