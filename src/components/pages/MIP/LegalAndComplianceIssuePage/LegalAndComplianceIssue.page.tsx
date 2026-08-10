'use client';

import { useTheme } from '@mui/material';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useUpdateMipr from '@/hooks/services/processor/useUpdateMipr';
import useIdentity from '@/hooks/useIdentity';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import MemoReference from '@/components/shared/SmiSection/MemoReference';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';


import useLegalAndComplianceIssue from './LegalAndComplianceIssue.hook';


const LegalAndComplianceIssuePage = () => {
  const theme = useTheme();
  const { processId: identityProcessId } = useIdentity();

  const {
    handleSave,
    container,
    setContainer,
    viewOnly,
    riskIdentificationDataContents,
    isRiskIdentificationLoading,
    setShouldGoNext,
    isSaveLoading,
    processId,
    stepperStatus,
    stepperSteps,
  } = useLegalAndComplianceIssue();

  useUpdateMipr({
    bucketParent: identityProcessId,
    stepperStatus,
    steps: stepperSteps,
  });

  return (
    <ColumnWrapper gap={theme.spacing(3)} paddingBottom={theme.spacing(3)}>
      <Title title="Legal and Compliance Issue" />
      <TableDebtorInformation module={TypeModule.MIP_REVIEW} process={TypeProcess.MIP_REVIEW} />
      <SectionTitle title="Legal & Compliance Issue" />
      <BaseContainer sx={{ boxShadow: 7 }}>
        <WordEditor
          isReadOnly={viewOnly}
          initialValue={riskIdentificationDataContents}
          container={container}
          setContainer={setContainer}
          isLoading={isRiskIdentificationLoading}
        />
      </BaseContainer>

      <MemoReference
        bucketProcessId={processId}
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.MIP_REVIEW}
        childProcess={TypeProcess.REVIEWER_DH}
      />

      <RowWrapper justifyContent="end" gap={theme.spacing(2)}>
        <Button
          isLoading={isSaveLoading}
          onClick={() => {setShouldGoNext(false); handleSave();}}
          disabled={viewOnly}
        >
          Save
        </Button>
        <Button
          isLoading={isSaveLoading}
          onClick={() => {setShouldGoNext(true); handleSave();}}
          disabled={viewOnly}
        >Next
        </Button>
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default LegalAndComplianceIssuePage;
