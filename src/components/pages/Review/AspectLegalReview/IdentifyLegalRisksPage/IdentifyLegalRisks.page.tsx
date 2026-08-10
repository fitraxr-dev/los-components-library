'use client';


import { TypeModule, TypeProcess } from '@/enums/Module';
import useIdentity from '@/hooks/useIdentity';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Text from '@/components/shared/Input/components/Text';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import AlertDifferentData from '@/components/shared/SmiComponent/AlertDifferentData';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import ConfirmationLatest from '../../components/ConfirmationLatest/ConfirmationLatest';

import { useIdentifyLegalRisks } from './IdentifyLegalRisks.hook';


const IdentifyLegalRisksPage = () => {
  const { processId } = useIdentity();

  const {
    viewOnly,
    container,
    setContainer,
    isAutoSaveFetching,
    isLoading,
    riskDetail,
    handleSaveOnly,
    handleSaveAndNext,
    canUpdate,
    handleNext,
  } = useIdentifyLegalRisks();


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
      <Title title="Identifikasi Resiko Hukum" />
      <TableDebtorInformation
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DH}
      />
      <SectionTitle title="Identifikasi Resiko Hukum" isMandatory />
      <ColumnWrapper sx={{ py: 3 }}>
        <Text isMandatory>
          Deskripsi Risiko
        </Text>
        <WordEditor
          id="descriptionRiskDh"
          container={container}
          setContainer={setContainer}
          isLoading={isLoading}
          initialValue={riskDetail?.riskDescription}
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

export default IdentifyLegalRisksPage;
