'use client';
import { TypeModule } from '@/enums/Module';
import useUpdateMipr from '@/hooks/services/processor/useUpdateMipr';
import useApp from '@/hooks/useApp';
import useIdentity from '@/hooks/useIdentity';

import useMipCcExpired from '@/components/pages/MIP/shared/hooks/useMipCcExpired';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TableDigitalMemo from '@/components/shared/SmiTable/ViewAllDocument/TableDigitalMemo';
import TableEloDocument from '@/components/shared/SmiTable/ViewAllDocument/TableEloDocument';
import TableFinancingDocument from '@/components/shared/SmiTable/ViewAllDocument/TableFinancingDocument';
import TableRefinaDocument from '@/components/shared/SmiTable/ViewAllDocument/TableRefinaDocument';
import TableSupportingDocument from '@/components/shared/SmiTable/ViewAllDocument/TableSupportingDocument';
import Title from '@/components/shared/Title';

import useViewAllDocument from './ViewAllDocument.hook';


const ViewAllDocumentPage = () => {
  const [state, _] = useApp();
  const { processId } = useIdentity();
  const isReview = state.pages.mipModule === TypeModule.MIP_REVIEW;
  const {
    bucketMasterId,
    isKadiv,
    isPemda,
    isRM,
    isTL,
    stepperStatus,
    stepperSteps,
    theme } = useViewAllDocument();

  useMipCcExpired({
    bucketMasterId,
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
    stepperStatus,
    steps: stepperSteps,
  });

  useUpdateMipr({
    bucketParent: processId,
    stepperStatus,
    steps: stepperSteps,
  });

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <Title title="View All Document" />

      <TableDigitalMemo
        module={state.pages.mipModule}
        process={state.pages.mipProcess}
      />

      <TableFinancingDocument
        module={state.pages.mipModule}
        process={state.pages.mipProcess}
        showModalSelector={true}
      />

      <TableSupportingDocument
        module={state.pages.mipModule}
        process={state.pages.mipProcess}
        showModalSelector={true}
      />


      {isPemda && (
        <TableRefinaDocument
          module={state.pages.mipModule}
          process={state.pages.mipProcess}
        />
      )}

      <TableEloDocument
        module={state.pages.mipModule}
        process={state.pages.mipProcess}
        showModalSelector={true}
      />
    </ColumnWrapper>
  );
};

export default ViewAllDocumentPage;
