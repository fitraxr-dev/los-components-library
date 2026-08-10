'use client';
import React from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useViewOnly from '@/hooks/useViewOnly';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import MemoReference from '@/components/shared/SmiSection/MemoReference';
import CorrectiveAction from '@/components/shared/SmiTable/CorrectiveAction';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Tabs, { TabItem } from '@/components/shared/Tabs';
import Title from '@/components/shared/Title';


import ReportingListRoutineTable from './components/ReportingListRoutine';
import { useEnvironmentalAndSafeguard } from './EnvironmentalAndSafeguard.hook';


const EnvironmentalAndSafeguardPage = () => {
  const { viewOnly } = useViewOnly();

  const {
    activeTab,
    handleChangeTab,
    handleNext,
    processId,
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
        <CorrectiveAction module={TypeModule.MUP} process={TypeProcess.MUP} isBusinessResponse viewOnly={viewOnly} />
      </TabItem>

      <TabItem activeValue={activeTab} value={1}>
        <ReportingListRoutineTable module={TypeModule.MUP} process={TypeProcess.MUP} isBusinessResponse />
      </TabItem>

      <MemoReference
        bucketProcessId={processId}
        module={TypeModule.MUP}
        process={TypeProcess.MUP}
        childProcess={TypeProcess.REVIEWER_DELST}
      />

      <RowWrapper sx={{ justifyContent: 'end', py: 3 }}>
        <Button onClick={handleNext}>
          Next
        </Button>
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default EnvironmentalAndSafeguardPage;
