import * as React from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useGetHistoryDraftMemoList from '@/hooks/services/useGetHistoryDraftMemoList';
import useApp from '@/hooks/useApp';
import useIdentity from '@/hooks/useIdentity';

import { TABLE_HEADER } from './TableMergeDocument.constant';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useTableMergeDocument = () => {
  const [state] = useApp();
  const { processId } = useIdentity();

  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const stepperData = state.stepper;
  const isBucketProcessCompleted = stepperData?.from === 'RR_PROCESS_TO_NEXT_STAGE';

  const {
    data: mergeDocumentData,
    isLoading: isMergeDocumentLoading,
  } = useGetHistoryDraftMemoList({
    filter: {
      bucketProcessId: processId,
      module: TypeModule.RISALAH_RAPAT,
      process: TypeProcess.RISALAH_RAPAT,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
  });

  const handleSignDocument = React.useCallback((data) => {
    NiceModal.show(
      MODAL.RISALAH_RAPAT.SIGN_DOCUMENT,
      {
        bucketProcessId: data.bucketProcessId,
        documentDate: data.createdAt ? String(data.createdAt).slice(0, 10) : '',
        documentId: data.id,
        documentName: data.fileName ?? '',
        documentNumber: data.documentNumber ?? '',
        fileName: data.fileName ?? '',
        module: TypeModule.RISALAH_RAPAT,
        process: TypeProcess.RISALAH_RAPAT,
      }
    );
  }, []);

  const handleViewDocumentDetail = React.useCallback((data) => {
    NiceModal.show(MODAL.RISALAH_RAPAT.DETAIL_MERGE_DOCUMENT, { id: data.id });
  }, []);

  const tableHeader: TableHeader[] = React.useMemo(() => {
    return [
      ...TABLE_HEADER,
      {
        key: 'status',
        label: 'Status',
        sx: { minWidth: '10vw' },
        type: 'status',
      },
      {
        key: 'action',
        label: 'Action',
        options: (props) => [
          {
            iconName: 'detail',
            onClick: handleViewDocumentDetail,
          },
          {
            iconName: 'preview-document',
            isDisabled: !props.isGenerated,
            isLoading: !props.isGenerated,
          },
          {
            iconName: 'download',
            isDisabled: !props.isGenerated,
            isLoading: !props.isGenerated,
          },
          {
            iconName: 'document-signature',
            isDisabled: !props.isGenerated,
            isHidden: props.status === 'Fully Sign off' || isBucketProcessCompleted,
            isLoading: !props.isGenerated,
            onClick: handleSignDocument,
          }
        ],
        type: 'action',
      }
    ];
  }, [handleViewDocumentDetail, handleSignDocument, isBucketProcessCompleted]);

  const tableData = React.useMemo(() => {
    const contents = mergeDocumentData?.contents;
    if (!contents) return undefined;

    return contents.map((item) => ({
      ...item,
      isGenerated: (item as any).isGenerated ?? null,
    }));
  }, [mergeDocumentData]);

  return {
    isLoading: isMergeDocumentLoading,
    page,
    pageSize,
    setPage,
    setPageSize,
    tableData,
    tableHeader,
    totalPage: mergeDocumentData?.page?.totalPage ?? 1,
  };
};

export default useTableMergeDocument;
