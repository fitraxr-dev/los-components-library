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

import { useClarifyingAssumptions } from './ClarifyingAssumptions.hook';


const ClarifyingAssumptionsPage = () => {
  const { processId } = useIdentity();
  const {
    clarifyingAssumptionsDetail,
    container,
    setContainer,
    handleSaveOnly,
    handleSaveAndNext,
    isAutoSaveFetching,
    isLoading,
    canUpdate,
    viewOnly,
    handleNext,
  } = useClarifyingAssumptions();


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
      <Title title="Asumsi & Kualifikasi" />
      <TableDebtorInformation
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DH}
      />


      <SectionTitle title="Asumsi & Kualifikasi" isMandatory />
      <WordEditor
        isReadOnly={viewOnly || !canUpdate}
        container={container}
        isLoading={isLoading}
        setContainer={setContainer}
        initialValue={clarifyingAssumptionsDetail?.description}
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

export default ClarifyingAssumptionsPage;
