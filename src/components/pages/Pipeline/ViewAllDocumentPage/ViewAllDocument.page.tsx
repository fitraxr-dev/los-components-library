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


const ViewAllDocPage = () => {
  const { isPemda } = useViewAllDocument();

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <Title title="View All Document" />

      <TableDigitalMemo
        module={TypeModule.PIPELINE}
        process={TypeProcess.PIPELINE}
      />

      <TableFinancingDocument
        module={TypeModule.PIPELINE}
        process={TypeProcess.PIPELINE}
        showModalSelector
        disableGroupOnKtpNpwp
      />

      <TableSupportingDocument
        module={TypeModule.PIPELINE}
        process={TypeProcess.PIPELINE}
        showModalSelector
      />

      {isPemda && (
        <TableRefinaDocument
          module={TypeModule.PIPELINE}
          process={TypeProcess.PIPELINE}
        />
      )}

      <TableEloDocument
        module={TypeModule.PIPELINE}
        process={TypeProcess.PIPELINE}
        showModalSelector
      />
    </ColumnWrapper>
  );
};

export default ViewAllDocPage;
