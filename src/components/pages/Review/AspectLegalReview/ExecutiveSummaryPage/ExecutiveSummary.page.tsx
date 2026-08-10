'use client';

import { TypeProcess, TypeModule } from '@/enums/Module';
import useIdentity from '@/hooks/useIdentity';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import AlertDifferentData from '@/components/shared/SmiComponent/AlertDifferentData';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import ConfirmationLatest from '../../components/ConfirmationLatest/ConfirmationLatest';

import { useExecutiveSummary } from './ExecutiveSummary.hook';


const ExecutiveSummaryPage = () => {
  const { processId } = useIdentity();
  const {
    executiveDetail,
    container,
    setContainer,
    handleSaveOnly,
    handleSaveAndNext,
    viewOnly,
    handleNext,
    isAutoSaveFetching,
    isLoading,
    canUpdate,
  } = useExecutiveSummary();


  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <AlertDifferentData
        bucketProcessId={processId}
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DH}
        isReviewer={true}
        refetchInterval={5000}
      />
      <ConfirmationLatest
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DH}
      />
      <Title title="Ringkasan Eksekutif " />
      <TableDebtorInformation
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DH}
      />


      <SectionTitle title="Ringkasan Eksekutif" isMandatory />
      <WordEditor
        isReadOnly={viewOnly || !canUpdate}
        container={container}
        setContainer={setContainer}
        isLoading={isLoading}
        initialValue={executiveDetail?.description}
      />

      <RowWrapper sx={{ gap: 2, justifyContent: 'end', py: 3 }}>
        {viewOnly || !canUpdate ? (
          <Button
            onClick={handleNext}
          >
            Next
          </Button>
        ) : (
          <>
            <Button
              isLoading={isLoading}
              disabled={isLoading || isAutoSaveFetching}
              onClick={handleSaveOnly}
            >
              {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
            </Button>
            <Button
              isLoading={isLoading}
              disabled={isLoading}
              onClick={handleSaveAndNext}
            >
              Next
            </Button>
          </>
        )}
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default ExecutiveSummaryPage;
