'use client';
import React from 'react';

import { Box, useTheme } from '@mui/material';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useUpdateMipr from '@/hooks/services/processor/useUpdateMipr';
import useIdentity from '@/hooks/useIdentity';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import MemoReference from '@/components/shared/SmiSection/MemoReference';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Tabs, { TabItem } from '@/components/shared/Tabs';
import Title from '@/components/shared/Title';

import TableExternalConcern from './components/TableExternalConcern';
import TableInternalConcern from './components/TableInternalConcern';
import useShariaComplianceAspect from './ShariaComplianceAspect.hook';


const ShariaComplianceAspectPage = () => {
  const theme = useTheme();
  const { processId: identityProcessId } = useIdentity();

  const {
    activeTab,
    handleChangeTab,
    processId,
    tabItems,
    tab,
    stepperStatus,
    stepperSteps,
  } = useShariaComplianceAspect();

  useUpdateMipr({
    bucketParent: identityProcessId,
    stepperStatus,
    steps: stepperSteps,
  });

  return (
    <ColumnWrapper gap={theme.spacing(3)} paddingBottom={theme.spacing(3)}>
      <Title title="Aspek Kepatuhan Syariah" />
      <TableDebtorInformation module={TypeModule.MIP_REVIEW} process={TypeProcess.MIP_REVIEW} />
      <Box>
        <Tabs
          activeTab={activeTab}
          onChange={handleChangeTab}
          items={tabItems}
        />

        <TabItem activeValue={activeTab} value={tab.INTERNAL}>
          <TableInternalConcern />
        </TabItem>
        <TabItem activeValue={activeTab} value={tab.EXTERNAL}>
          <TableExternalConcern />
        </TabItem>
      </Box>

      <MemoReference
        bucketProcessId={processId}
        module={ TypeModule.MIP_REVIEW}
        process={TypeProcess.MIP_REVIEW}
        childProcess={TypeProcess.REVIEWER_DK}
      />
    </ColumnWrapper>
  );
};

export default ShariaComplianceAspectPage;
