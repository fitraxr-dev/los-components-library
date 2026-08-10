import * as React from 'react';

import { MODAL } from '@/configs/constants/modalId';
import { risalahRapat } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetDocumentList from '@/hooks/services/useGetDocumentList';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import {
  DocumentTypeRequestDtoDocumentCategoryEnum,
  DocumentTypeRequestDtoDocumentParentEnum,
  DocumentTypeRequestDtoOwnershipEnum,
} from '@/services/openapi/bucket-document-service';

import useSendToSPFP from '../../../hooks/useSendtoSPFP';

import { TABLE_HEADER } from './ModalSendToSPFP.constant';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useModalSendToSPFP = () => {
  const router = useCustomRouter();
  const { processId } = useIdentity();

  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [selectedDocument, setSelectedDocument] = React.useState<Set<number>>(new Set());

  const {
    data: signedDocumentData,
    isLoading: isSignedDocumentLoading,
  } = useGetDocumentList({
    filter: {
      bucketProcessId: processId,
      documentCategory: DocumentTypeRequestDtoDocumentCategoryEnum.DIGITALMEMO,
      documentParent: DocumentTypeRequestDtoDocumentParentEnum.RISALAHRAPAT,
      module: TypeModule.RISALAH_RAPAT,
      ownership: DocumentTypeRequestDtoOwnershipEnum.RISALAHRAPATMERGED,
      process: TypeProcess.RISALAH_RAPAT,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
  });

  const handleSelectDocument = React.useCallback((row) => {
    setSelectedDocument((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(row.id)) newSelected.delete(row.id);
      else newSelected.add(row.id);
      return newSelected;
    });
  }, []);

  const tableHeader: TableHeader[] = React.useMemo(() => {
    return [
      {
        isSelected: (row) => selectedDocument.has(row.id),
        key: 'checkbox',
        onSelectChange: handleSelectDocument,
        type: 'checkbox',
      },
      ...TABLE_HEADER,
      {
        key: 'action',
        label: 'Action',
        options: [
          { iconName: 'preview-document' },
          { iconName: 'download' },
        ],
        type: 'action',
      },
    ];
  }, [selectedDocument, handleSelectDocument]);

  const { mutate: sendToSPFP } = useSendToSPFP({
    onError: () => {
      showNiceModalV2({ title: 'Terjadi kesalahan, silahkan dicoba lagi', type: 'error' });
    },
    onSuccess: () => {
      showNiceModalV2({
        onClose: () => {
          closeNiceModal(MODAL.RISALAH_RAPAT.SEND_TO_SPFP);
          router.push(risalahRapat.DRAFT_LIST_PAGE);
        },
        title: 'Dokumen berhasil dikirim ke SPFP',
        type: 'success',
      });
    },
  });

  const handleSendToSPFP = React.useCallback(() => {
    sendToSPFP({
      bucketProcessId: processId,
      documentList: Array.from(selectedDocument),
      module: TypeModule.RISALAH_RAPAT,
      process: TypeProcess.RISALAH_RAPAT,
    });
  }, [processId, selectedDocument, sendToSPFP]);

  return {
    handleSendToSPFP,
    isLoading: isSignedDocumentLoading,
    page,
    pageSize,
    selectedDocument,
    setPage,
    setPageSize,
    tableData: signedDocumentData?.contents,
    tableHeader,
    totalPage: signedDocumentData?.page?.totalPage ?? 1,
  };
};

export default useModalSendToSPFP;
