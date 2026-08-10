import * as React from 'react';

import { MODAL } from '@/configs/constants/modalId';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetDocumentList from '@/hooks/services/useGetDocumentList';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import {
  DocumentTypeRequestDtoDocumentParentEnum,
  DocumentTypeRequestDtoOwnershipEnum,
} from '@/services/openapi/bucket-document-service';

import useSaveAttachmentRisalahRapat from '../../../hooks/useSaveAttachmentRisalahRapat';

import { TABLE_HEADER } from './ModalMergeDocument.constant';

import type { TableHeader } from '@/components/shared/Table/Table.types';


export const useModalMergeDocument = () => {
  const { processId } = useIdentity();

  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [selectedDocument, setSelectedDocument] = React.useState<Set<number>>(new Set());

  const { data: risalahRapatDocumentData, isLoading: isRisalahRapatDocumentLoading } = useGetDocumentList({
    filter: {
      bucketProcessId: processId,
      documentParent: DocumentTypeRequestDtoDocumentParentEnum.RISALAHRAPAT,
      module: TypeModule.RISALAH_RAPAT,
      ownership: DocumentTypeRequestDtoOwnershipEnum.RISALAHRAPAT,
      process: TypeProcess.RISALAH_RAPAT,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
  });

  const { mutate: mergeDocument, isPending: isMergeDocumentLoading } = useSaveAttachmentRisalahRapat({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      closeNiceModal(MODAL.RISALAH_RAPAT.MERGE_DOCUMENT);
      showNiceModalV2({
        title: 'Data sedang di process, silahkan cek beberapa saat lagi.',
        type: 'success',
      });
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
  }, [selectedDocument]);

  const handleMergeDocument = React.useCallback(() => {
    if (!processId || !selectedDocument) return;

    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => mergeDocument({
        bucketProcessId: String(processId),
        listId: Array.from(selectedDocument),
        module: TypeModule.RISALAH_RAPAT,
        process: TypeProcess.RISALAH_RAPAT,
      }),
      submitText: 'Ya',
      title: 'Apakah anda yakin isi Dokumen Risalah Rapat sudah sama dengan data NEW LOS?',
      type: 'warning',
    });
  }, [mergeDocument, processId, selectedDocument]);

  return {
    handleMergeDocument,
    isLoading: isRisalahRapatDocumentLoading || isMergeDocumentLoading,
    page,
    pageSize,
    selectedDocument,
    setPage,
    setPageSize,
    tableData: risalahRapatDocumentData?.contents,
    tableHeader,
    totalPage: risalahRapatDocumentData?.page?.totalPage ?? 1,
  };
};
