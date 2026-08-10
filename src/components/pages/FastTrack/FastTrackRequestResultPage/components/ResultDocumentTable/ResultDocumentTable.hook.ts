'use client';

import * as React from 'react';

import { useParams, usePathname } from 'next/navigation';

import { TypeModule, TypeProcess } from '@/enums/Module';
import { downloadFile, previewFile } from '@/helpers/utils';
import useIdentity from '@/hooks/useIdentity';
import useSessionStorage from '@/hooks/useSessionStorage';

import useDeleteSelectedDocument from './hooks/useDeleteSelectedDocument';
import useGetResultDocuments from './hooks/useGetResultDocument';
import useSaveSelectedDocument from './hooks/useSaveSelectedDocument';
import { TABLE_HEADER } from './ResultDocumentTable.constant';

import type { TableHeader, onDndProps } from '@/components/shared/DndTable/DndTable.types';
import type { DocumentTypeRequestDtoDocumentParentEnum } from '@/services/openapi/bucket-document-service';


const getRowId = (row: any): string | number | undefined =>
  row?.id ?? row?.documentId ?? row?.fileName;

interface UseResultDocumentTableProps {
  documentParent: DocumentTypeRequestDtoDocumentParentEnum;
  ownerId: string;
}

const useResultDocumentTable = ({ documentParent, ownerId }: UseResultDocumentTableProps) => {
  const { processId, debtorId } = useIdentity();
  const { id } = useParams();
  const [summaryDetailId, setSummaryDetailId] = useSessionStorage('summaryDetailId', null);
  const summaryId = (id && id !== 'null' ? Number(id) : null) ?? (summaryDetailId ? Number(summaryDetailId) : null);
  const [tableData, setTableData] = React.useState({
    selectedDocuments: [],
    summaryDocuments: [],
  });

  const path = usePathname();
  const pathSegments = path.split('/').filter((segment) => segment);
  const moduleIndex = pathSegments[5];
  const isEditMode = moduleIndex === 'edit';


  const [page, setPage] = React.useReducer(
    (state, patch) => ({ ...state, ...patch }),
    { selectedDocuments: 1, summaryDocuments: 1 }
  );
  const [pageSize, setPageSize] = React.useReducer(
    (state, patch) => ({ ...state, ...patch }),
    { selectedDocuments: 5, summaryDocuments: 5 }
  );

  const anomalyRow = React.useCallback((data: any) => {
    if (data.isSelected === true) {
      return {
        backgroundColor: '#FFF9C4',
      };
    }
    return {};
  }, []);

  const { selectedDocuments, summaryDocuments, isLoading: isLoadingDocument } = useGetResultDocuments(
    {
      filter: {
        bucketProcessId: processId,
        documentParent,
        id: summaryId,
        module: TypeModule.FAST_TRACK,
        ownerId,
        process: TypeProcess.FAST_TRACK,
      },
      page: {
        itemPerPage: pageSize.summaryDocuments,
        noPage: page.summaryDocuments,
      },
    },
    {
      filter: {
        debtorId,
        ownerId,
        summaryId,
      },
      page: {
        itemPerPage: pageSize.selectedDocuments,
        noPage: page.selectedDocuments,
      },
    }
  );

  const { mutate: saveSelectedDocument, isPending: isPendingSave } = useSaveSelectedDocument({
    onSuccess: (data) => {
      const newId = data?.content?.id as number | undefined | null;
      if (newId && !summaryDetailId) setSummaryDetailId(newId);
    },
  });

  const { mutate: deleteSelectedDocument, isPending: isPendingDelete } = useDeleteSelectedDocument();

  const hasPending = isPendingSave || isPendingDelete;

  React.useEffect(() => {
    if (hasPending) return;
    const summary = Array.isArray(summaryDocuments?.contents) ? summaryDocuments.contents : [];
    const selected = Array.isArray(selectedDocuments?.contents) ? selectedDocuments.contents : [];

    setTableData({
      selectedDocuments: selected,
      summaryDocuments: summary,
    });
  }, [summaryDocuments?.contents, selectedDocuments?.contents, hasPending]);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem('summaryDetailId');
  }, []);

  const createDndHandler = React.useCallback(
    (destKey: string) =>
      (data: onDndProps) => {
        const nextDest = Array.isArray(data?.newTableData) ? data.newTableData : [];
        const moved = data?.currentItem;
        console.log('MOVED', moved);

        setTableData((prev) => {
          if (!moved) return { ...prev, [destKey]: nextDest };

          const movedId = getRowId(moved);
          const inSummary = prev.summaryDocuments.some((r) => getRowId(r) === movedId);
          const inSelected = prev.selectedDocuments.some((r) => getRowId(r) === movedId);
          const srcKey = inSummary ? 'summaryDocuments' : inSelected ? 'selectedDocuments' : destKey;
          const isCrossList = srcKey !== destKey;

          const next = {
            selectedDocuments:
              destKey === 'selectedDocuments'
                ? nextDest
                : isCrossList && srcKey === 'selectedDocuments'
                  ? prev.selectedDocuments.filter((r) => getRowId(r) !== movedId)
                  : prev.selectedDocuments,
            summaryDocuments:
              destKey === 'summaryDocuments'
                ? nextDest
                : isCrossList && srcKey === 'summaryDocuments'
                  ? prev.summaryDocuments.filter((r) => getRowId(r) !== movedId)
                  : prev.summaryDocuments,
          };

          return next;
        });

        if (!moved) return;

        const payload = {
          ...moved,
          debtorId,
          isEdit: isEditMode,
          summaryDetailId: summaryId,
        };

        if (destKey === 'selectedDocuments') {
          saveSelectedDocument(payload);
        } else {
          deleteSelectedDocument(payload);
        }
      },
    [debtorId, summaryId, saveSelectedDocument, deleteSelectedDocument, isEditMode]
  );


  const tableHeader: TableHeader[] = React.useMemo(() => [
    ...TABLE_HEADER,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'preview-document',
          onClick: (row: any) => {
            if (!row?.document) return;
            previewFile(row.document);
          },
        },
        {
          iconName: 'download',
          onClick: (row: any) => {
            if (!row?.document || !row?.fileName) return;
            downloadFile(row.document, row.fileName);
          },
        }],
      sx: { minWidth: '9vw' },
      type: 'action',
    },
  ], []);

  return {
    anomalyRow,
    handleSelectedDnd: createDndHandler('selectedDocuments'),
    handleSummaryDnd: createDndHandler('summaryDocuments'),
    isLoading: isLoadingDocument || isPendingDelete || isPendingSave,
    page,
    pageSize,
    setPage,
    setPageSize,
    tableData,
    tableHeader,
    totalPage: {
      selectedDocuments: selectedDocuments?.page?.totalPage ?? 1,
      summaryDocuments: summaryDocuments?.page?.totalPage ?? 1,
    },
  };
};

export default useResultDocumentTable;
