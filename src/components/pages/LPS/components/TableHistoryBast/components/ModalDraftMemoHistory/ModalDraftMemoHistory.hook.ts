import showNiceModalV2 from '@/helpers/showNiceModalV2';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';


import useSaveHistoryDraftMemo from '../../hooks/useSaveHistoryDraftMemo';
import { modal } from '../../TableHistoryBast.constants';

import type { SaveDataProps } from './ModalDraftMemoHistory.types';


export const useModalDraftMemoHistory = (props) => {
  const { processId } = useIdentity();

  const { isPending: saveHistoryDraftLoading, mutate } = useSaveHistoryDraftMemo({
    onSuccess: () => {
      closeNiceModal(modal.HISTORY_DRAFT_MEMO);
      showNiceModalV2({
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const handleOnSave = (data: SaveDataProps) => {
    const extension = data.document.extension.split('.')[1];

    const payload = {
      bucketProcessId: processId,
      documentDate: data.documentDate,
      documentName: data.documentName,
      file: data.document.file,
      fileExtension: extension,
      id: null,
      module: props.module,
      process: props.process,
    };

    mutate({
      bucketProcessId: processId,
      payload,
    });
  };

  return {
    handleOnSave,
    saveHistoryDraftLoading,
  };
};
