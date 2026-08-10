'use client';
import React from 'react';

import { useTheme } from '@mui/material';

import { TypeModule, TypeProcess } from '@/enums/Module';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import MemoReference from '../components/MemoReference';

import useLegalAndComplianceIssue from './LegalAndComplianceIssue.hook';


const LegalAndComplianceIssuePage = () => {
  const theme = useTheme();

  const {
    riskIdentificationDataContents,
    isRiskIdentificationLoading,
    tableHeader,
    handleNext,
  } = useLegalAndComplianceIssue();

  return (
    <ColumnWrapper gap={theme.spacing(3)} paddingBottom={theme.spacing(3)}>
      <Title title="Legal and Compliance Issue" />
      <TableDebtorInformation module={TypeModule.MUP} process={TypeProcess.MUP} />
      <BaseContainer sx={{ boxShadow: 7 }}>
        <Table
          isLoading={isRiskIdentificationLoading}
          tableHeader={tableHeader}
          tableData={riskIdentificationDataContents}
        />
      </BaseContainer>
      <MemoReference />
      <RowWrapper justifyContent="end">
        <Button onClick={handleNext}>
          Next
        </Button>
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default LegalAndComplianceIssuePage;
