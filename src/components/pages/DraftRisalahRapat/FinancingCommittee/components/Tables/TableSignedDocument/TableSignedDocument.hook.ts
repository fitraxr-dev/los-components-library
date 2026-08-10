import * as React from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useGetDocumentList from '@/hooks/services/useGetDocumentList';
import useIdentity from '@/hooks/useIdentity';
import {
  DocumentTypeRequestDtoDocumentCategoryEnum,
  DocumentTypeRequestDtoDocumentParentEnum,
  DocumentTypeRequestDtoOwnershipEnum,
} from '@/services/openapi/bucket-document-service';

import { TABLE_HEADER } from './TableSignedDocument.constant';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useTableSignedDocument = () => {
  const { processId } = useIdentity();

  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const {
    data: signedDocumentData,
    isLoading: isSignedDocumentLoading,
    isFetching: isFetchingSignedDocument,
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

  const handleViewDocumentDetail = React.useCallback((data) => {
    NiceModal.show(MODAL.RISALAH_RAPAT.DETAIL_SIGNED_DOCUMENT, { id: data.id });
  }, []);

  const tableHeader: TableHeader[] = React.useMemo(() => {
    return [
      ...TABLE_HEADER,
      {
        key: 'action',
        label: 'Action',
        options: () => [
          {
            iconName: 'detail',
            onClick: handleViewDocumentDetail,
          },
          { iconName: 'preview-document' },
          { iconName: 'download' },
        ],
        type: 'action',
      }
    ];
  }, [handleViewDocumentDetail]);

  return {
    isLoading: isSignedDocumentLoading || isFetchingSignedDocument,
    page,
    pageSize,
    setPage,
    setPageSize,
    tableData: signedDocumentData?.contents,
    tableHeader,
    totalPage: signedDocumentData?.page?.totalPage ?? 1,
  };
};

export default useTableSignedDocument;
