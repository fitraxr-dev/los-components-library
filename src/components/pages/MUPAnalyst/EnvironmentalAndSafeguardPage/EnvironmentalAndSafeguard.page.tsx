'use client';
import React from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import CorrectiveAction from '@/components/shared/SmiTable/CorrectiveAction';
import ReportingListRoutine from '@/components/shared/SmiTable/ReportingListRoutine';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Tabs, { TabItem } from '@/components/shared/Tabs';
import Title from '@/components/shared/Title';

import MemoReference from '../components/MemoReference';

import { useEnvironmentalAndSafeguard } from './EnvironmentalAndSafeguard.hook';


const EnvironmentalAndSafeguardPage = () => {

  const {
    activeTab,
    handleChangeTab,
    handleNext,
  } = useEnvironmentalAndSafeguard();

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <Title title="Environmental and Social Safeguard Issue" />
      <TableDebtorInformation module={TypeModule.MUP} process={TypeProcess.MUP} />
      <Tabs
        activeTab={activeTab}
        onChange={handleChangeTab}
        items={[
          {
            label: 'Daftar Corrective Action Plan',
          },
          {
            label: 'Daftar Pelaporan Rutin',
          },
        ]}
      />
      <TabItem activeValue={activeTab} value={0}>
        <CorrectiveAction module={TypeModule.MUP} process={TypeProcess.MUP} isBusinessResponse />
      </TabItem>

      <TabItem activeValue={activeTab} value={1}>
        <ReportingListRoutine module={TypeModule.MUP} process={TypeProcess.MUP} isBusinessResponse />
      </TabItem>

      <MemoReference />

      <RowWrapper sx={{ justifyContent: 'end', py: 3 }}>
        <Button onClick={handleNext}>
          Next
        </Button>
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default EnvironmentalAndSafeguardPage;
