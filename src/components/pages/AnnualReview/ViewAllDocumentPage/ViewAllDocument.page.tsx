'use client';
import { TypeModule } from '@/enums/Module';

import { useAnnualReviewContext } from '@/components/layouts/AnnualReviewLayout/AnnualReview.context';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TableDigitalMemo from '@/components/shared/SmiTable/ViewAllDocument/TableDigitalMemo';
import TableEloDocument from '@/components/shared/SmiTable/ViewAllDocument/TableEloDocument';
import TableFinancingDocument from '@/components/shared/SmiTable/ViewAllDocument/TableFinancingDocument';
import TableRefinaDocument from '@/components/shared/SmiTable/ViewAllDocument/TableRefinaDocument';
import TableSupportingDocument from '@/components/shared/SmiTable/ViewAllDocument/TableSupportingDocument';
import Title from '@/components/shared/Title';

import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';

import useViewAllDocument from './ViewAllDocument.hook';


const ViewAllDocumentPage = () => {
  const { isPemda, typeProcess } = useViewAllDocument();
  const { isDepiDivision } = useAnnualReviewContext();

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      {isDepiDivision && <ConfirmationLatest />}
      <Title title="View All Document" />

      <TableDigitalMemo
        module={TypeModule.ANNUAL_REVIEW}
        process={typeProcess}
      />

      <TableFinancingDocument
        module={TypeModule.ANNUAL_REVIEW}
        process={typeProcess}
        showModalSelector={true}
      />

      <TableSupportingDocument
        module={TypeModule.ANNUAL_REVIEW}
        process={typeProcess}
        showModalSelector={true}
      />


      {isPemda && (
        <TableRefinaDocument
          module={TypeModule.ANNUAL_REVIEW}
          process={typeProcess}
        />
      )}

      <TableEloDocument
        module={TypeModule.ANNUAL_REVIEW}
        process={typeProcess}
        showModalSelector={true}
      />
    </ColumnWrapper>
  );
};

export default ViewAllDocumentPage;
