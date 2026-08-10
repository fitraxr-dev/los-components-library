'use client';
import React from 'react';

import { Box, useTheme } from '@mui/material';

import { TypeModule, TypeProcess } from '@/enums/Module';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import MemoReference from '@/components/shared/SmiSection/MemoReference';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Tabs, { TabItem } from '@/components/shared/Tabs';
import Title from '@/components/shared/Title';


import TableExternalConcern from './components/TableExternalConcern';
import TableInternalConcern from './components/TableInternalConcern';
import useShariaComplianceAspect from './ShariaComplianceAspect.hook';


const ShariaComplianceAspectPage = () => {
  const {
    activeTab,
    canView,
    handleChangeTab,
    handleNext,
    processId,
    tabItems,
    tab,
    viewOnly,
  } = useShariaComplianceAspect();

  if (!canView) {
    return null;
  }

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <Title title="Aspek Kepatuhan Syariah" />
      <TableDebtorInformation module={TypeModule.MUP} process={TypeProcess.MUP} />
      <Box>
        <Tabs
          activeTab={activeTab}
          onChange={handleChangeTab}
          items={tabItems}
        />

        <TabItem activeValue={activeTab} value={tab.INTERNAL}>
          <TableInternalConcern viewOnly={viewOnly} />
        </TabItem>
        <TabItem activeValue={activeTab} value={tab.EXTERNAL}>
          <TableExternalConcern viewOnly={viewOnly} />
        </TabItem>
      </Box>

      <MemoReference
        bucketProcessId={processId}
        module={TypeModule.MUP}
        process={TypeProcess.MUP}
        childProcess={TypeProcess.REVIEWER_DK}
      />

      <RowWrapper sx={{ justifyContent: 'end', py: 3 }}>
        <Button onClick={handleNext}>
          Next
        </Button>
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default ShariaComplianceAspectPage;
