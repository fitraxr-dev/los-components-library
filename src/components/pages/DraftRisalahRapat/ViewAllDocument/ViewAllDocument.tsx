'use client';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { DocumentCreationRequestDtoDocumentParentEnum } from '@/services/openapi/bucket-document-service';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TableDigitalMemo from '@/components/shared/SmiTable/ViewAllDocument/TableDigitalMemo';
import TableFinancingDocument from '@/components/shared/SmiTable/ViewAllDocument/TableFinancingDocument';
import TableSupportingDocument from '@/components/shared/SmiTable/ViewAllDocument/TableSupportingDocument';
import Title from '@/components/shared/Title';


const ViewAllDocumentPage = () => {

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <Title title="View All Document" />
      <TableDigitalMemo module={TypeModule.RISALAH_RAPAT} process={TypeProcess.RISALAH_RAPAT} />

      <TableFinancingDocument
        documentParent={DocumentCreationRequestDtoDocumentParentEnum.FINANCINGDOCUMENT}
        module={TypeModule.RISALAH_RAPAT}
        process={TypeProcess.RISALAH_RAPAT}
        title="Document Pembiayaan"
      />

      <TableSupportingDocument
        title="Supporting Document"
        documentParent={DocumentCreationRequestDtoDocumentParentEnum.SUPPORTINGDOCUMENT}
        module={TypeModule.RISALAH_RAPAT}
        process={TypeProcess.RISALAH_RAPAT}
      />
    </ColumnWrapper>
  );
};

export default ViewAllDocumentPage;
