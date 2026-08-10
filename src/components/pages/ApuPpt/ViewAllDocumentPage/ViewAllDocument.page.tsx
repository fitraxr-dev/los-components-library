'use client';


import { TypeModule } from '@/enums/Module';
import { DocumentTypeRequestDtoDocumentParentEnum } from '@/services/openapi/bucket-document-service';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TableDigitalMemo from '@/components/shared/SmiTable/ViewAllDocument/TableDigitalMemo';
import TableEloDocument from '@/components/shared/SmiTable/ViewAllDocument/TableEloDocument';
import TableFinancingDocument from '@/components/shared/SmiTable/ViewAllDocument/TableFinancingDocument';
import TableRefinaDocument from '@/components/shared/SmiTable/ViewAllDocument/TableRefinaDocument';
import TableSupportingDocument from '@/components/shared/SmiTable/ViewAllDocument/TableSupportingDocument';
import Title from '@/components/shared/Title';

import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';

import useViewAllDocument from './ViewAllDocument.hook';


const DebtorInfoProfile = () => {
  const { theme, process, isPemda, isDeletable } = useViewAllDocument();

  return (
    <ColumnWrapper gap={theme.spacing(3)} >
      <ConfirmationLatest />
      <ColumnWrapper gap={theme.spacing(3)} >
        <Title title="View All Document" />

        <TableDigitalMemo
          module={TypeModule.APU_PPT}
          process={process}
        />
        <TableFinancingDocument
          isDeletable={isDeletable}
          title="Document Pembiayaan"
          module={TypeModule.APU_PPT}
          process={process}
          showModalSelector
          approvedMandatory={[DocumentTypeRequestDtoDocumentParentEnum.DOCUMENTAPUPPT]}
        />
        <TableSupportingDocument
          isDeletable={isDeletable}
          title="Supporting Document"
          module={TypeModule.APU_PPT}
          process={process}
          showModalSelector
          approvedMandatory={[DocumentTypeRequestDtoDocumentParentEnum.DOCUMENTAPUPPT]}
        />
        {isPemda && (
          <TableRefinaDocument
            module={TypeModule.APU_PPT}
            process={process}
          />
        )}
        <TableEloDocument
          module={TypeModule.APU_PPT}
          process={process}
          showModalSelector
        />
      </ColumnWrapper>
    </ColumnWrapper>
  );
};

export default DebtorInfoProfile;
