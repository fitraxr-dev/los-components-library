'use client';

import { useTheme } from '@mui/material';

import { TypeModule, TypeProcess } from '@/enums/Module';

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

  const {
    handleSave,
    container,
    setContainer,
    isAutoSaveFetching,
    isViewOnly,
    riskIdentificationDataContents,
    isRiskIdentificationLoading,
    processId,
  } = useLegalAndComplianceIssue();

  return (
    <ColumnWrapper gap={theme.spacing(3)} paddingBottom={theme.spacing(3)}>
      <Title title="Legal and Compliance Issue" />
      <TableDebtorInformation module={TypeModule.MUP} process={TypeProcess.MUP} />
      <SectionTitle title="Legal & Compliance Issue" />
      <BaseContainer sx={{ boxShadow: 7 }}>
        <WordEditor
          isReadOnly={isViewOnly}
          initialValue={riskIdentificationDataContents}
          container={container}
          setContainer={setContainer}
          isLoading={isRiskIdentificationLoading}
        />
      </BaseContainer>
      <MemoReference
        bucketProcessId={processId}
        module={ TypeModule.MUP}
        process={TypeProcess.MUP}
        childProcess={TypeProcess.REVIEWER_DH}
      />
      <RowWrapper justifyContent="end" sx={{ gap: 2, py: 3 }}>
        {!isViewOnly ? (
          <>
            <Button
              onClick={() => handleSave(false)}
              disabled={isAutoSaveFetching}
            >
              {isAutoSaveFetching ? 'Auto Saving...' : 'Save'}
            </Button>
            <Button onClick={() => handleSave(true)}>
              Next
            </Button>
          </>
        ) : (
          <Button onClick={() => handleSave()}>
            Next
          </Button>
        )}
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default LegalAndComplianceIssuePage;
