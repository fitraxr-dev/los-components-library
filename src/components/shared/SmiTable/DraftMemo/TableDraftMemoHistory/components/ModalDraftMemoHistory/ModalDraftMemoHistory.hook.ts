import { dayJsJakartaKeepV2 } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';


import useSaveHistoryDraftMemo from '../../hooks/useSaveHistoryDraftMemo';
import { modal } from '../../TableDraftMemoHistory.constants';

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

    const documentDate = dayJsJakartaKeepV2(data.documentDate).format('YYYY-MM-DD');

    mutate({
      bucketProcessId: processId,
      documentDate: documentDate,
      documentName: data.documentName,
      file: data.document.file,
      fileExtension: extension,
      id: undefined,
      module: props.module,
      process: props.process,
    });
  };

  return {
    handleOnSave,
    saveHistoryDraftLoading,
  };
};
