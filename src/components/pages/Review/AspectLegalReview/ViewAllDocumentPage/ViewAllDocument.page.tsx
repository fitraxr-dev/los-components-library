'use client';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useIdentity from '@/hooks/useIdentity';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import AlertDifferentData from '@/components/shared/SmiComponent/AlertDifferentData';
import TableDigitalMemo from '@/components/shared/SmiTable/ViewAllDocument/TableDigitalMemo';
import TableEloDocument from '@/components/shared/SmiTable/ViewAllDocument/TableEloDocument';
import TableFinancingDocument from '@/components/shared/SmiTable/ViewAllDocument/TableFinancingDocument';
import TableRefinaDocument from '@/components/shared/SmiTable/ViewAllDocument/TableRefinaDocument';
import TableSupportingDocument from '@/components/shared/SmiTable/ViewAllDocument/TableSupportingDocument';
import Title from '@/components/shared/Title';

import ConfirmationLatest from '../../components/ConfirmationLatest/ConfirmationLatest';

import useViewAllDocument from './ViewAllDocument.hook';


const ViewAllDocumentPage = () => {
  const { isPemda } = useViewAllDocument();
  const { processId } = useIdentity();

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <AlertDifferentData
        bucketProcessId={processId}
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DH}
        isReviewer={true}
        refetchInterval={5000}
      />
      <ConfirmationLatest
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DH}
      />
      <Title title="View All Document" />

      <TableDigitalMemo
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DH}
      />

      <TableFinancingDocument
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DH}
        title="Document Pembiayaan"
      />

      <TableSupportingDocument
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DH}
        title="Supporting Document"
      />

      {isPemda && (
        <TableRefinaDocument
          module={TypeModule.MIP_REVIEW}
          process={TypeProcess.REVIEWER_DH}
        />
      )}
      <TableEloDocument
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DH}
      />
    </ColumnWrapper>
  );
};

export default ViewAllDocumentPage;
