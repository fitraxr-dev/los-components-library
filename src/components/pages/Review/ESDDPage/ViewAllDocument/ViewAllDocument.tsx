'use client';


import { TypeModule, TypeProcess } from '@/enums/Module';
import useIdentity from '@/hooks/useIdentity';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import AlertDifferentData from '@/components/shared/SmiComponent/AlertDifferentData';
import TableDigitalMemo from '@/components/shared/SmiTable/ViewAllDocument/TableDigitalMemo';
import TableEloDocument from '@/components/shared/SmiTable/ViewAllDocument/TableEloDocument';
import TableFinancingDocument from '@/components/shared/SmiTable/ViewAllDocument/TableFinancingDocument';
import TableRefinaDocument from '@/components/shared/SmiTable/ViewAllDocument/TableRefinaDocument';
import TableSupportingDocument from '@/components/shared/SmiTable/ViewAllDocument/TableSupportingDocument';
import Title from '@/components/shared/Title';


import ConfirmationLatest from '../../components/ConfirmationLatest/ConfirmationLatest';

import useViewAllDocument from './ViewAllDocument.hook';


const ViewAllDocumentPage = () => {
  const { processId } = useIdentity();
  const { isPemda } = useViewAllDocument();
  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <AlertDifferentData
        bucketProcessId={processId}
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DELST}
        isReviewer={true}
        refetchInterval={5000}
      />
      <ConfirmationLatest
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DELST}
      />
      <Title title="View All Document" />
      <TableDigitalMemo module={TypeModule.MIP_REVIEW} process={TypeProcess.REVIEWER_DELST} />

      <TableFinancingDocument
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DELST}
      />

      <TableSupportingDocument
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DELST}
        title="Supporting Document"
      />
      {isPemda && (
        <TableRefinaDocument
          module={TypeModule.MIP_REVIEW}
          process={TypeProcess.REVIEWER_DELST}
        />
      )}
      <TableEloDocument
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DELST}
      />

    </ColumnWrapper>
  );
};

export default ViewAllDocumentPage;
