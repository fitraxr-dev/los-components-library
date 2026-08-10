'use client';
import React from 'react';

import { Box, useTheme } from '@mui/material';

import { TypeModule, TypeProcess } from '@/enums/Module';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Tabs, { TabItem } from '@/components/shared/Tabs';
import Title from '@/components/shared/Title';

import MemoReference from '../components/MemoReference';

import TableExternalConcern from './components/TableExternalConcern';
import TableInternalConcern from './components/TableInternalConcern';
import useShariaComplianceAspect from './ShariaComplianceAspect.hook';


const ShariaComplianceAspectPage = () => {
  const theme = useTheme();

  const {
    activeTab,
    handleChangeTab,
    handleNext,
  } = useShariaComplianceAspect();

  return (
    <ColumnWrapper gap={theme.spacing(3)} paddingBottom={theme.spacing(3)}>
      <Title title="Aspek Kepatuhan Syariah" />
      <TableDebtorInformation module={TypeModule.MUP} process={TypeProcess.MUP} />
      <Box>
        <Tabs
          activeTab={activeTab}
          onChange={handleChangeTab}
          items={[
            {
              label: 'Internal Concern',
            },
            {
              label: 'External Concern',
            }
          ]}
        />

        <TabItem activeValue={activeTab} value={0}>
          <TableInternalConcern />
        </TabItem>
        <TabItem activeValue={activeTab} value={1}>
          <TableExternalConcern />
        </TabItem>
      </Box>

      <MemoReference />

      <RowWrapper justifyContent="end">
        <Button onClick={handleNext}>
          Next
        </Button>
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default ShariaComplianceAspectPage;
