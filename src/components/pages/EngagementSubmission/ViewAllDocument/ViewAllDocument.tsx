'use client';
import { TypeModule, TypeProcess } from '@/enums/Module';
import {
  DocumentTypeRequestDtoDocumentCategoryEnum,
  DocumentTypeRequestDtoDocumentParentEnum,
} from '@/services/openapi/bucket-document-service';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TableUploadDocumentRipple from '@/components/shared/SmiTable/TableUploadDocumentRipple';
import TableDigitalMemo from '@/components/shared/SmiTable/ViewAllDocument/TableDigitalMemo';
import TableEloDocument from '@/components/shared/SmiTable/ViewAllDocument/TableEloDocument';
import TableRefinaDocument from '@/components/shared/SmiTable/ViewAllDocument/TableRefinaDocument';
import Title from '@/components/shared/Title';

import useViewAllDocument from './useViewAllDocument';


const ViewAllDocumentPage = () => {

  const { isPemda, rippleToDocument } = useViewAllDocument();

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <Title title="View All Document" />
      <TableDigitalMemo
        module={TypeModule.ENGAGEMENT_AGREEMENT}
        process={TypeProcess.ENGAGEMENT_AGREEMENT}
      />

      <TableUploadDocumentRipple
        module={TypeModule.ENGAGEMENT_AGREEMENT}
        process={TypeProcess.ENGAGEMENT_AGREEMENT}
        title="Document Pembiayaan"
        rippleTo={rippleToDocument}
        isDocumentCategoryDisable
        type={DocumentTypeRequestDtoDocumentCategoryEnum.FINANCINGDOCUMENT}
        documentCategory={DocumentTypeRequestDtoDocumentCategoryEnum.FINANCINGDOCUMENT}
        documentParent={DocumentTypeRequestDtoDocumentParentEnum.FINANCINGDOCUMENT}
        showModalSelector={true}
      />

      <TableUploadDocumentRipple
        module={TypeModule.ENGAGEMENT_AGREEMENT}
        process={TypeProcess.ENGAGEMENT_AGREEMENT}
        title="Supporting Document"
        rippleTo={rippleToDocument}
        isDocumentCategoryDisable
        type={DocumentTypeRequestDtoDocumentCategoryEnum.SUPPORTINGDOCUMENT}
        documentCategory={DocumentTypeRequestDtoDocumentCategoryEnum.SUPPORTINGDOCUMENT}
        documentParent={DocumentTypeRequestDtoDocumentParentEnum.SUPPORTINGDOCUMENT}
        showModalSelector={true}
      />

      {isPemda && (
        <TableRefinaDocument
          module={TypeModule.ENGAGEMENT_AGREEMENT}
          process={TypeProcess.ENGAGEMENT_AGREEMENT}
        />
      )}

      <TableEloDocument
        module={TypeModule.ENGAGEMENT_AGREEMENT}
        process={TypeProcess.ENGAGEMENT_AGREEMENT}
        showModalSelector={true}
      />

    </ColumnWrapper>
  );
};

export default ViewAllDocumentPage;
