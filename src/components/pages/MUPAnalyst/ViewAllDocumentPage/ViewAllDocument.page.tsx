'use client';
import { TypeModule, TypeProcess } from '@/enums/Module';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TableDigitalMemo from '@/components/shared/SmiTable/ViewAllDocument/TableDigitalMemo';
import TableEloDocument from '@/components/shared/SmiTable/ViewAllDocument/TableEloDocument';
import TableFinancingDocument from '@/components/shared/SmiTable/ViewAllDocument/TableFinancingDocument';
import TableRefinaDocument from '@/components/shared/SmiTable/ViewAllDocument/TableRefinaDocument';
import TableSupportingDocument from '@/components/shared/SmiTable/ViewAllDocument/TableSupportingDocument';
import Title from '@/components/shared/Title';

import useViewAllDocument from './ViewAllDocument.hook';


const ViewAllDocumentPage = () => {
  const { canView, isPemda } = useViewAllDocument();

  if (!canView) {
    return null;
  }

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <Title title="View All Document" />

      <TableDigitalMemo
        module={TypeModule.MUP}
        process={TypeProcess.MUP_ANALYST}
      />

      <TableFinancingDocument
        module={TypeModule.MUP}
        process={TypeProcess.MUP_ANALYST}
      />

      <TableSupportingDocument
        module={TypeModule.MUP}
        process={TypeProcess.MUP_ANALYST}
      />


      {isPemda && (
        <TableRefinaDocument
          module={TypeModule.MUP}
          process={TypeProcess.MUP_ANALYST}
        />
      )}

      <TableEloDocument
        module={TypeModule.MUP}
        process={TypeProcess.MUP_ANALYST}
      />
    </ColumnWrapper>
  );
};

export default ViewAllDocumentPage;
