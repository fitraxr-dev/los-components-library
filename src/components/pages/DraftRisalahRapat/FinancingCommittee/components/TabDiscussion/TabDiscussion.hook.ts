import * as React from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useDeleteDocument from '@/hooks/services/useDeleteDocument';
import useGetDocumentList from '@/hooks/services/useGetDocumentList';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';
import {
  DocumentTypeRequestDtoDocumentParentEnum,
  DocumentTypeRequestDtoOwnershipEnum,
} from '@/services/openapi/bucket-document-service';

import { TABLE_HEADER } from './TabDiscussion.constant';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useTabDiscussion = () => {
  const { processId } = useIdentity();
  const { viewOnly } = useViewOnly();

  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const {
    data: risalahRapatDocumentsData,
    isLoading: isRisalahRapatDocumentsLoading,
    isFetching: isRisalahRapatDocumentsFetching,
  } = useGetDocumentList({
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

  const { mutate: deleteDocument } = useDeleteDocument({
    onError: () => {
      showNiceModalV2({ title: 'Gagal menghapus data', type: 'error' });
    },
    onSuccess: () => {
      showNiceModalV2({ title: 'Data berhasil dihapus', type: 'success' });
    },
  });

  const handleDeleteDocument = React.useCallback((data) => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => {
        deleteDocument({
          bucketProcessId: processId,
          documentParent: DocumentTypeRequestDtoDocumentParentEnum.WAITINGAPPROVAL,
          payload: { id: data.id },
        });
      },
      submitText: 'Ya',
      title: 'Apakah anda yakin ingin menghapus data?',
      type: 'warning',
    });
  }, [deleteDocument, processId]);

  const handleViewDocumentDetail = React.useCallback((data) => {
    NiceModal.show(MODAL.RISALAH_RAPAT.DETAIL_FINAL_DOCUMENT, { id: data.id });
  }, []);

  const actionColumn: TableHeader = React.useMemo(() => {
    return {
      key: 'action',
      label: 'Action',
      options: (row) => [
        {
          iconName: 'detail',
          onClick: handleViewDocumentDetail,
        },
        { iconName: 'preview-document' },
        { iconName: 'download' },
        {
          iconName: 'delete',
          isDisabled: viewOnly,
          onClick: handleDeleteDocument,
        },
      ],
      type: 'action',
    };
  }, [handleDeleteDocument, viewOnly]);

  const tableHeader: TableHeader[] = React.useMemo(
    () => [...TABLE_HEADER, actionColumn],
    [actionColumn]
  );

  const handleOpenAddFinalDocumentModal = React.useCallback(() => {
    NiceModal.show(MODAL.RISALAH_RAPAT.ADD_FINAL_DOCUMENT, {
      title: 'Add New Lampiran Document',
    });
  }, []);

  return {
    handleOpenAddFinalDocumentModal,
    isLoading: isRisalahRapatDocumentsLoading || isRisalahRapatDocumentsFetching,
    page,
    pageSize,
    setPage,
    setPageSize,
    tableData: risalahRapatDocumentsData?.contents,
    tableHeader,
    totalPage: risalahRapatDocumentsData?.page?.totalPage ?? 1,
  };
};

export default useTabDiscussion;
