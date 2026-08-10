import * as React from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import type { TypeModule, TypeProcess } from '@/enums/Module';


interface UseModalSignDocumentProps {
  bucketProcessId: string;
  documentId: number;
  documentDate?: string;
  documentName?: string;
  documentNumber?: string;
  fileName?: string;
  module: TypeModule;
  process: TypeProcess;
}

const useModalSignDocument = ({
  bucketProcessId,
  documentDate,
  documentId,
  documentName,
  documentNumber,
  fileName,
  module,
  process,
}: UseModalSignDocumentProps) => {
  const handlePrivyDocumentSign = React.useCallback(() => {
    closeNiceModal(MODAL.RISALAH_RAPAT.SIGN_DOCUMENT);

    NiceModal.show(MODAL.RISALAH_RAPAT.PRIVY_CONFIGURATION, {
      bucketProcessId,
      documentId,
      module,
      process,
    });
  }, [bucketProcessId, documentId, module, process]);

  const handleManualDocumentSign = React.useCallback(() => {
    closeNiceModal(MODAL.RISALAH_RAPAT.SIGN_DOCUMENT);
    NiceModal.show(MODAL.RISALAH_RAPAT.MANUAL_SIGN_DOCUMENT, {
      documentDate,
      documentId,
      documentName,
      documentNumber,
      fileName,
    });
  }, [documentDate, documentId, documentName, documentNumber, fileName]);

  return {
    handleManualDocumentSign,
    handlePrivyDocumentSign,
  };
};

export default useModalSignDocument;
