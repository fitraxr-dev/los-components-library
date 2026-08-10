'use client';
import React from 'react';

import { useTheme } from '@mui/material';

import { TypeModule, TypeProcess } from '@/enums/Module';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Title from '@/components/shared/Title';

import RiskProfileTable from './components/TableRiskProfile';


const RiskProfile = () => {
  const theme = useTheme();


  return (
    <>
      <ColumnWrapper gap={theme.spacing(3)}>
        <Title title="Profil Risiko" />
        <TableDebtorInformation module={TypeModule.MUP} process={TypeProcess.MUP} />
        <RiskProfileTable />
      </ColumnWrapper>
    </>
  );
};

export default RiskProfile;
