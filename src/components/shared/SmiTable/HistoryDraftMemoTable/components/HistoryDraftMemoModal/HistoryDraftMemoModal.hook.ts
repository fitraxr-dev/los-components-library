import { MODAL } from '@/configs/constants/modalId';
import { dayJsJakartaKeep } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';

import useSaveHistoryDraftMemo from '../../hooks/useSaveHistoryDraftMemo';

import type { SaveDataProps } from './HistoryDraftMemoModal.types';


export const useHistoryDraftMemoModal = () => {
  const { processId } = useIdentity();

  const { isPending: saveHistoryDraftLoading, mutate } = useSaveHistoryDraftMemo({
    onSuccess: () => {
      closeNiceModal(MODAL.PROPOSAL.HISTORY_DRAFT_MEMO);
      showNiceModalV2({ title: 'Data berhasil disimpan', type: 'success' });
    },
  });

  const handleOnSave = (data: SaveDataProps) => {
    const extension = data.document.extension.split('.')[1];

    const payload = {
      bucketProcessId: processId,
      documentDate: dayJsJakartaKeep(data.documentDate),
      documentName: data.documentName,
      file: data.document.file,
      fileExtension: extension,
      id: null,
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
