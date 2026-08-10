'use client';

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
  const {
    isPemda,
    module,
    process,
  } = useViewAllDocument();

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <ConfirmationLatest />
      <Title title="View All Document" />
      <TableDigitalMemo module={module} process={process} />

      <TableFinancingDocument
        module={module}
        process={process}
        showModalSelector={true}
      />

      <TableSupportingDocument
        module={module}
        process={process}
        showModalSelector={true}
      />

      {isPemda && (
        <TableRefinaDocument
          module={module}
          process={process}
        />
      )}

      <TableEloDocument
        module={module}
        process={process}
        showModalSelector={true}
      />
    </ColumnWrapper>
  );
};

export default ViewAllDocumentPage;
