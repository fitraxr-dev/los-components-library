import dayjs from 'dayjs';

import { MODAL } from '@/configs/constants/modalId';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { dayJsJakartaKeep } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useAddDocument from '@/hooks/services/useAddDocument';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import {
  DocumentCreationRequestDtoDocumentCategoryEnum,
  DocumentGroupParamRequestDtoDocumentCategoryEnum,
  DocumentTypeRequestDtoDocumentParentEnum,
  DocumentTypeRequestDtoOwnershipEnum,
} from '@/services/openapi/bucket-document-service';

import type { SaveDataProps } from './ModalAddFinalDocument.types';


export const useModalAddFinalDocument = () => {
  const { processId, debiturName } = useIdentity();

  const { isPending: saveDocumentIsLoading, mutate: addDocument } = useAddDocument({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      closeNiceModal(MODAL.RISALAH_RAPAT.ADD_FINAL_DOCUMENT);
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

    addDocument({
      bucketProcessId: String(processId),
      document: data.document.file,
      documentCategory: DocumentCreationRequestDtoDocumentCategoryEnum.RISALAHRAPAT,
      documentDate: dayJsJakartaKeep(documentDate),
      documentExtension: extension,
      documentGroup: DocumentGroupParamRequestDtoDocumentCategoryEnum.RISALAHRAPAT,
      documentName: data.documentName,
      documentNumber: data.documentNumber,
      documentParent: DocumentTypeRequestDtoDocumentParentEnum.RISALAHRAPAT,
      documentType: DocumentTypeRequestDtoDocumentParentEnum.RISALAHRAPAT,
      fileName: `RisalahRapat_${debiturName}_${data.documentNumber}_${dayjs(data.documentDate).format('DDMMYYYY')}`,
      id: null,
      module: TypeModule.RISALAH_RAPAT,
      ownership: DocumentTypeRequestDtoOwnershipEnum.RISALAHRAPAT,
      process: TypeProcess.RISALAH_RAPAT,
    });
  };

  return {
    handleOnSave,
    saveDocumentIsLoading,
  };
};
