'use client';

import { TypeModule, TypeProcess } from '@/enums/Module';
import { DocumentCreationRequestDtoDocumentParentEnum } from '@/services/openapi/bucket-document-service';

import { useFastTrackContext } from '@/components/layouts/FastTrackLayout/FastTrack.context';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import TableDigitalMemo from '@/components/shared/SmiTable/ViewAllDocument/TableDigitalMemo';
import TableEloDocument from '@/components/shared/SmiTable/ViewAllDocument/TableEloDocument';
import TableFinancingDocument from '@/components/shared/SmiTable/ViewAllDocument/TableFinancingDocument';
import TableRefinaDocument from '@/components/shared/SmiTable/ViewAllDocument/TableRefinaDocument';
import TableSupportingDocument from '@/components/shared/SmiTable/ViewAllDocument/TableSupportingDocument';
import Title from '@/components/shared/Title';

import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';

import useViewAllDocument from './ViewAllDocument.hook';


const ViewAllDocumentPage = () => {
  const { isRequestModule } = useFastTrackContext();

  const process = TypeProcess.FAST_TRACK;

  const { isPemda } = useViewAllDocument();


  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <ConfirmationLatest />
      <Title title="View All Document" />
      <TableDebtorInformation
        module={TypeModule.FAST_TRACK}
        process={process}
      />
      <TableDigitalMemo
        module={TypeModule.FAST_TRACK}
        process={process}
      />
      <TableFinancingDocument
        title="Document Pembiayaan"
        module={TypeModule.FAST_TRACK}
        process={process}
        showModalSelector={true}
      // approvedMandatory={[DocumentCreationRequestDtoDocumentParentEnum.FINANCINGDOCUMENT]}
      // documentParent={DocumentCreationRequestDtoDocumentParentEnum.FINANCINGDOCUMENT}
      />
      <TableSupportingDocument
        title="Supporting Document"
        module={TypeModule.FAST_TRACK}
        process={process}
        showModalSelector={true}
      // approvedMandatory={[DocumentCreationRequestDtoDocumentParentEnum.SUPPORTINGDOCUMENT]}
      // documentParent={DocumentCreationRequestDtoDocumentParentEnum.SUPPORTINGDOCUMENT}
      />
      {isPemda && (
        <TableRefinaDocument
          module={TypeModule.FAST_TRACK}
          process={process}
        />
      )}
      <TableEloDocument
        module={TypeModule.FAST_TRACK}
        process={process}
        showModalSelector={true}
      />
    </ColumnWrapper>
  );
};

export default ViewAllDocumentPage;
