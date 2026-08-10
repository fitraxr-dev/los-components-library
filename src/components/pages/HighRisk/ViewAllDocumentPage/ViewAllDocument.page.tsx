'use client';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { DocumentTypeRequestDtoDocumentParentEnum } from '@/services/openapi/bucket-document-service';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TableDigitalMemo from '@/components/shared/SmiTable/ViewAllDocument/TableDigitalMemo';
import TableEloDocument from '@/components/shared/SmiTable/ViewAllDocument/TableEloDocument';
import TableFinancingDocument from '@/components/shared/SmiTable/ViewAllDocument/TableFinancingDocument';
import TableRefinaDocument from '@/components/shared/SmiTable/ViewAllDocument/TableRefinaDocument';
import TableSupportingDocument from '@/components/shared/SmiTable/ViewAllDocument/TableSupportingDocument';
import Title from '@/components/shared/Title';

import useViewAllDocument from './ViewAllDocument.hook';


const ViewAllDocumentPage = () => {
  const { theme, isPemda } = useViewAllDocument();

  return (
    <ColumnWrapper sx={{ gap: theme.spacing(3) }}>
      <Title title="View All Document" />

      <TableDigitalMemo
        module={TypeModule.HIGH_RISK}
        process={TypeProcess.HIGH_RISK_DK}
      />
      <TableFinancingDocument
        title="Document Pembiayaan"
        module={TypeModule.HIGH_RISK}
        process={TypeProcess.HIGH_RISK_DK}
        showModalSelector
        approvedMandatory={[DocumentTypeRequestDtoDocumentParentEnum.FINANCINGDOCUMENT]}
      />
      <TableSupportingDocument
        title="Supporting Document"
        module={TypeModule.HIGH_RISK}
        process={TypeProcess.HIGH_RISK_DK}
        showModalSelector
        approvedMandatory={[DocumentTypeRequestDtoDocumentParentEnum.SUPPORTINGDOCUMENT]}
      />
      {isPemda && (
        <TableRefinaDocument
          module={TypeModule.HIGH_RISK}
          process={TypeProcess.HIGH_RISK_DK}
        />
      )}
      <TableEloDocument
        module={TypeModule.HIGH_RISK}
        process={TypeProcess.HIGH_RISK_DK}
        showModalSelector
      />
    </ColumnWrapper>
  );
};

export default ViewAllDocumentPage;
