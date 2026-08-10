import dayjs from 'dayjs';

import { MODAL } from '@/configs/constants/modalId';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { dayJsJakartaKeep } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import {
  DocumentCreationRequestDtoDocumentCategoryEnum,
  DocumentTypeRequestDtoDocumentParentEnum,
  DocumentTypeRequestDtoOwnershipEnum,
} from '@/services/openapi/bucket-document-service';

import useUploadManualDocument from './hooks/useUploadManualDocument';

import type { SaveDataProps } from './ModalManualSignDocument.types';


const useModalManualSignDocument = ({ documentId, fileName }: { documentId: number; fileName?: string }) => {
  const { processId } = useIdentity();

  const { mutate: signDocument, isPending: isSignDocumentLoading } = useUploadManualDocument({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      closeNiceModal(MODAL.RISALAH_RAPAT.MANUAL_SIGN_DOCUMENT);
      showNiceModalV2({
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const handleOnSave = (data: SaveDataProps) => {
    const extension = data.document.extension.split('.')[1];
    const now = dayjs();
    const documentDate = dayjs(data.documentDate)
      .hour(now.hour())
      .minute(now.minute())
      .second(now.second())
      .millisecond(now.millisecond());

    signDocument({
      bucketProcessId: String(processId),
      document: data.document.file,
      documentCategory: DocumentCreationRequestDtoDocumentCategoryEnum.DIGITALMEMO,
      documentDate: dayJsJakartaKeep(documentDate),
      documentExtension: extension,
      documentGroup: 'INTERNAL_MEMO',
      documentName: data.documentName,
      documentNumber: data.documentNumber,
      documentParent: DocumentTypeRequestDtoDocumentParentEnum.DIGITALMEMO,
      documentType: DocumentTypeRequestDtoDocumentParentEnum.RISALAHRAPAT,
      fileName: fileName,
      id: null,
      module: TypeModule.RISALAH_RAPAT,
      ownership: DocumentTypeRequestDtoOwnershipEnum.RISALAHRAPATMERGED,
      process: TypeProcess.RISALAH_RAPAT,
      rrId: documentId,
    });
  };

  return {
    handleOnSave,
    isSignDocumentLoading,
  };
};

export default useModalManualSignDocument;
