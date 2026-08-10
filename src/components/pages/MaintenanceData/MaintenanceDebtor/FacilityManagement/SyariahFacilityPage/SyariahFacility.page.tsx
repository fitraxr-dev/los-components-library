'use client';
import React from 'react';

import { Box, useTheme } from '@mui/material';

import { TypeModule, TypeProcess } from '@/enums/Module';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Tabs, { TabItem } from '@/components/shared/Tabs';
import Title from '@/components/shared/Title';

import ActionFooterDetail from '../../components/ActionFooterDetail/ActionFooterDetail';

import ExistingFacilityTab from './components/ExistingFacilityTab';
import ProposedFacilityTab from './components/ProposedFacilityTab';
import TableDebtorInformationSyariah from './components/TableDebtorInformationLocal';
import { tab, tabItems } from './SyariahFacility.constants';
import useSyariahFacility from './SyariahFacility.hook';


const SyariahFacilityPage = () => {
  const theme = useTheme();

  const {
    activeTab,
    handleChangeTab,
    isDebtor,
  } = useSyariahFacility();

  return (
    <ColumnWrapper gap={theme.spacing(3)}>
      <Title title="Fasilitas Syariah" />
      {isDebtor ?
        <TableDebtorInformationSyariah />
        :
        <TableDebtorInformation
          isMaintenanceCustomer={true}
          module={TypeModule.MAINTENANCE_DATA}
          process={TypeProcess.MAINTENANCE_CUSTOMER}
        />
      }
      <Tabs items={tabItems} onChange={handleChangeTab} activeTab={activeTab} />
      <Box sx={{ width: '100%' }}>
        <TabItem activeValue={activeTab} value={tab.proposed}>
          <ProposedFacilityTab />
        </TabItem>
        <TabItem activeValue={activeTab} value={tab.existing}>
          <ExistingFacilityTab />
        </TabItem>
      </Box>

      <ActionFooterDetail />
    </ColumnWrapper>
  );
};

export default SyariahFacilityPage;
