import * as React from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { usePathname } from 'next/navigation';

import { eligibilityReview } from '@/configs/constants/pathname';
import { getLastPath, matchesPathname, replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { downloadFileV2 } from '@/helpers/utils';
import useDeleteDocument from '@/hooks/services/useDeleteDocument';
import useGetDocumentList from '@/hooks/services/useGetDocumentList';
import useApp from '@/hooks/useApp';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';
import {
  DocumentTypeRequestDtoDocumentParentEnum,
  DocumentTypeRequestDtoOwnershipEnum,
} from '@/services/openapi/bucket-document-service';

import { action, modal, TABLE_HEADER_UPLOAD_DOCUMENT } from './TableUploadDocumentRisalahRapat.constant';

import type { EditDocumentProps } from './TableUploadDocumentRisalahRapat.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useTableUploadDocumentRisalahRapat = ({ module, process, childId }) => {
  const { processId } = useIdentity();
  const { viewOnly } = useViewOnly();
  const [{ stepper }] = useApp();
  const path = usePathname();

  const moduleIndex = React.useMemo(() => path?.split('/')?.[4] ?? '', [path]);
  const isEligibilityReview = React.useMemo(
    () =>
      replacePath(eligibilityReview.ADDITIONAL_INFORMATION_PAGE, {
        module: moduleIndex,
        processId,
      }),
    [moduleIndex, processId]
  );

  const currentUrlPath = React.useMemo(() => getLastPath(path), [path]);
  const actionButtons = React.useMemo(
    () => stepper?.steps?.find((dt) => dt.urlPath === currentUrlPath)?.action ?? {},
    [stepper, currentUrlPath]
  );

  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const { data: documentListData, isFetching: isDocumentListLoading } = useGetDocumentList({
    filter: {
      bucketProcessId: childId ?? String(processId),
      documentParent: DocumentTypeRequestDtoDocumentParentEnum.WAITINGAPPROVAL,
      module: module,
      ownership: DocumentTypeRequestDtoOwnershipEnum.RISALAHRAPAT,
      process: process,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    sortList: {
      columnName: 'modifiedDate',
      sortType: 'DESC',
    },
  });

  const { mutate: deleteDocument } = useDeleteDocument({
    onSuccess: () => {
      showNiceModalV2({
        title: 'Data berhasil dihapus',
        type: 'success',
      });
    },
  });

  const handleDeleteDocument = React.useCallback((id?: number) => {
    if (!id && id !== 0) return;
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => {
        deleteDocument({
          bucketProcessId: String(processId),
          documentParent: undefined,
          ownership: DocumentTypeRequestDtoOwnershipEnum.RISALAHRAPAT,
          payload: { id },
        });
      },
      submitText: 'Ya',
      title: 'Apakah anda yakin ingin menghapus data? ',
      type: 'warning',
    });
  }, [deleteDocument, processId]);

  const handleEditDocument = React.useCallback(({ id, module, process, ownership, childId }: EditDocumentProps) => {
    NiceModal.show(modal.MODAL_UPLOAD_DOCUMENT, {
      childId,
      id,
      module,
      ownership,
      process,
    });
  }, []);

  const {
    TABLE_UPLOAD_DOCUMENT_EDIT,
    TABLE_UPLOAD_DOCUMENT_DELETE,
    TABLE_UPLOAD_DOCUMENT_DOWNLOAD,
  } = action;

  const actionOptions = React.useMemo(() => {
    const editCol = {
      iconName: 'edit',
      isDisabled: viewOnly,
      onClick: (row: any) =>
        handleEditDocument({
          childId,
          id: row?.id,
          module,
          ownership: DocumentTypeRequestDtoOwnershipEnum.RISALAHRAPAT,
          process,
        }),
    };

    const deleteCol = {
      iconName: 'delete',
      isDisabled: viewOnly,
      onClick: (row: any) => handleDeleteDocument(row?.id),
    };

    const previewCol = {
      iconName: 'preview-document',
      onClick: (row: any) => {
        const url = row?.document;
        if (!url) return;
        window.open(`${url}?preview=true`, '_blank', 'noopener,noreferrer');
      },
    };

    const downloadCol = {
      iconName: 'download',
      onClick: (row: any) => {
        if (!row?.document) return;
        downloadFileV2(row.document, row?.fileName);
      },
    };

    const templateOrder = [
      TABLE_UPLOAD_DOCUMENT_EDIT,
      TABLE_UPLOAD_DOCUMENT_DELETE,
      TABLE_UPLOAD_DOCUMENT_DOWNLOAD,
    ];

    const configuredKeys = Object.keys(actionButtons ?? {});
    if (configuredKeys.length > 0) {
      const mapByKey: Record<string, any> = {
        [TABLE_UPLOAD_DOCUMENT_DELETE]: deleteCol,
        [TABLE_UPLOAD_DOCUMENT_DOWNLOAD]: [previewCol, downloadCol],
        [TABLE_UPLOAD_DOCUMENT_EDIT]: editCol,
      };

      return templateOrder.flatMap((key) => {
        if (!configuredKeys.includes(key)) return [];
        const entry = mapByKey[key];
        return Array.isArray(entry) ? entry : [entry];
      });
    }

    if (matchesPathname(path, isEligibilityReview)) {
      return [editCol, deleteCol, previewCol, downloadCol];
    }

    return [
      { iconName: 'detail', onClick: (row: any) => NiceModal.show(modal.DOCUMENT_DETAIL, { id: row?.id }) },
      editCol,
      deleteCol,
      previewCol,
      downloadCol,
    ];
  }, [
    actionButtons,
    childId,
    handleDeleteDocument,
    handleEditDocument,
    isEligibilityReview,
    module,
    path,
    process,
    viewOnly,
    TABLE_UPLOAD_DOCUMENT_DELETE,
    TABLE_UPLOAD_DOCUMENT_DOWNLOAD,
    TABLE_UPLOAD_DOCUMENT_EDIT,
  ]);

  const tableHeader: TableHeader[] = React.useMemo(() => {
    return [
      ...TABLE_HEADER_UPLOAD_DOCUMENT,
      {
        key: 'action',
        label: 'Action',
        options: actionOptions,
        sx: { minWidth: '8vw' },
        type: 'action',
      },
    ];
  }, [actionOptions]);

  const handleOpenAddDocumentModal = React.useCallback(() => {
    const createProps: Partial<EditDocumentProps> = { childId, module, process };
    if (!childId) delete createProps.childId;
    NiceModal.show(modal.MODAL_UPLOAD_DOCUMENT, createProps);
  }, [childId, module, process]);

  return {
    handleOpenAddDocumentModal,
    isLoading: isDocumentListLoading,
    page,
    pageSize,
    setPage,
    setPageSize,
    tableData: documentListData?.contents,
    tableHeader,
    totalPage: documentListData?.page?.totalPage ?? 1,
  };
};

export default useTableUploadDocumentRisalahRapat;
