'use client';

import { TypeModule, TypeProcess } from '@/enums/Module';
import { DocumentCreationRequestDtoDocumentParentEnum } from '@/services/openapi/bucket-document-service';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TableDigitalMemo from '@/components/shared/SmiTable/ViewAllDocument/TableDigitalMemo';
import TableEloDocument from '@/components/shared/SmiTable/ViewAllDocument/TableEloDocument';
import TableFinancingDocument from '@/components/shared/SmiTable/ViewAllDocument/TableFinancingDocument';
import TableRefinaDocument from '@/components/shared/SmiTable/ViewAllDocument/TableRefinaDocument';
import TableSupportingDocument from '@/components/shared/SmiTable/ViewAllDocument/TableSupportingDocument';
import Title from '@/components/shared/Title';

import useViewAllDocument from './ViewAllDocument.hook';


const ViewAllDocPage = () => {
  const { theme, isPemda } = useViewAllDocument();

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <Title title="View All Document" />

      <TableDigitalMemo
        module={TypeModule.SITE_VISIT}
        process={TypeProcess.SITE_VISIT}
      />

      <TableFinancingDocument
        title="Document Pembiayaan"
        module={TypeModule.SITE_VISIT}
        process={TypeProcess.SITE_VISIT}
        documentParent={DocumentCreationRequestDtoDocumentParentEnum.FINANCINGDOCUMENT}
        showModalSelector
      />

      <TableSupportingDocument
        title="Supporting Document"
        module={TypeModule.SITE_VISIT}
        process={TypeProcess.SITE_VISIT}
        documentParent={DocumentCreationRequestDtoDocumentParentEnum.SUPPORTINGDOCUMENT}
        showModalSelector
      />

      {isPemda && (
        <TableRefinaDocument
          module={TypeModule.SITE_VISIT}
          process={TypeProcess.SITE_VISIT}
        />
      )}

      <TableEloDocument
        title="Document ELO"
        module={TypeModule.SITE_VISIT}
        process={TypeProcess.SITE_VISIT}
        documentParent={DocumentCreationRequestDtoDocumentParentEnum.ELO}
        showModalSelector
      />
    </ColumnWrapper>
  );
};

export default ViewAllDocPage;
