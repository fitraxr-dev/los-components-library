'use client';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useIdentity from '@/hooks/useIdentity';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Text from '@/components/shared/Input/components/Text';
import RowWrapper from '@/components/shared/RowWrapper';
import AlertDifferentData from '@/components/shared/SmiComponent/AlertDifferentData';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import ConfirmationLatest from '../../components/ConfirmationLatest/ConfirmationLatest';

import { useRiskProfile } from './riskProfile.hook';


const RiskProfileListPage = () => {
  const { processId } = useIdentity();
  const {
    isAutoSaveFetching,
    isLoading,
    riskDetail,
    container,
    setContainer,
    viewOnly,
    handleSaveOnly,
    handleSaveAndNext,
    canUpdate,
    handleNext,
  } = useRiskProfile();

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <AlertDifferentData
        bucketProcessId={processId}
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DEPI}
        isReviewer={true}
        refetchInterval={5000}
      />
      <ConfirmationLatest
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DEPI}
      />
      <Title title="Profil Risiko" />
      <TableDebtorInformation
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DEPI}
      />
      <ColumnWrapper sx={{ py: 3 }}>
        <Text>
          Deskripsi Risiko
        </Text>
        <WordEditor
          id="descriptionDepi"
          container={container}
          setContainer={setContainer}
          isLoading={isLoading}
          initialValue={riskDetail?.description}
          isReadOnly={viewOnly || !canUpdate}
        />
      </ColumnWrapper>
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

export default RiskProfileListPage;
