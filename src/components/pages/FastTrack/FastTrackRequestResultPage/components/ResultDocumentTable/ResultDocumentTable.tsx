'use client';

import { Box } from '@mui/material';

import DndTable from '@/components/shared/DndTable';
import { DndTableProvider } from '@/components/shared/DndTable/DndTable';
import TextStyle from '@/components/shared/TextStyle';

import useResultDocumentTable from './ResultDocumentTable.hook';

import type { DocumentTypeRequestDtoDocumentParentEnum } from '@/services/openapi/bucket-document-service';


interface ResultDocumentTableProps {
  documentParent: DocumentTypeRequestDtoDocumentParentEnum;
  ownerId: string;
}

const ResultDocumentTable = ({ documentParent, ownerId }: ResultDocumentTableProps) => {
  const {
    handleSelectedDnd,
    handleSummaryDnd,
    isLoading,
    page,
    pageSize,
    anomalyRow,
    setPage,
    setPageSize,
    tableData,
    tableHeader,
    totalPage,
  } = useResultDocumentTable({ documentParent, ownerId });

  return (
    <DndTableProvider>
      <Box sx={{ mb: 3 }}>
        <TextStyle variant="body4" weight={600} color="primary.main">
          Document Fast Track Result
        </TextStyle>

        <DndTable
          tableId="summaryDocuments"
          tableHeader={tableHeader}
          tableData={tableData.summaryDocuments}
          onDragAndDrop={handleSummaryDnd}
          totalPage={totalPage.summaryDocuments}
          currentPage={page.summaryDocuments}
          handlePageChange={(p: number) => setPage({ summaryDocuments: p })}
          pageSize={pageSize.summaryDocuments}
          onPageSizeChange={(s: number) => setPageSize({ summaryDocuments: s })}
          isLoading={isLoading}
          anomalyRow={anomalyRow}
        />
      </Box>

      <Box>
        <TextStyle variant="body4" weight={600} color="primary.main">
          Dokumen yang Dipilih
        </TextStyle>

        <DndTable
          tableId="selectedDocuments"
          tableHeader={tableHeader}
          tableData={tableData.selectedDocuments}
          onDragAndDrop={handleSelectedDnd}
          totalPage={totalPage.selectedDocuments}
          currentPage={page.selectedDocuments}
          handlePageChange={(p: number) => setPage({ selectedDocuments: p })}
          pageSize={pageSize.selectedDocuments}
          onPageSizeChange={(s: number) => setPageSize({ selectedDocuments: s })}
          isLoading={isLoading}
        />
      </Box>
    </DndTableProvider>
  );
};

export default ResultDocumentTable;
