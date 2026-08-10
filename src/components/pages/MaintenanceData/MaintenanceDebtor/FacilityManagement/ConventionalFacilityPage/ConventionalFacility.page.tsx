'use client';
import React from 'react';

import { Box, useTheme } from '@mui/material';

import { TypeModule, TypeProcess } from '@/enums/Module';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Tabs, { TabItem } from '@/components/shared/Tabs';
import Title from '@/components/shared/Title';

import ActionFooterDetail from '../../components/ActionFooterDetail/ActionFooterDetail';
import TableDebtorInformationLocal from '../../components/TableDebtorInformationLocal';

import ExistingFacilityTab from './components/ExistingFacilityTab';
import ProposedFacilityTab from './components/ProposedFacilityTab';
import { tab, tabItems } from './ConventionalFacility.constants';
import useConventionalFacility from './ConventionalFacility.hook';


const ConventionalFacilityPage = () => {
  const theme = useTheme();

  const { activeTab, handleChangeTab, debtorData, isDebtor } = useConventionalFacility();

  return (
    <ColumnWrapper gap={theme.spacing(3)}>
      <Title title="Fasilitas Konvensional" />
      { isDebtor ?
        <>
          <TableDebtorInformationLocal
            debtorName={debtorData?.name}
            gamName={debtorData?.gamName}
            staffName={debtorData?.staffName}
            isNewClient={debtorData?.isNewDebtor}
            cif={debtorData?.cif}
            division={debtorData?.divisionName}
            debtorId={debtorData?.debtorId}
            createdAt={debtorData?.createdDate}
          />
        </> :
        <>
          <TableDebtorInformation
            isMaintenanceCustomer={true}
            module={TypeModule.MAINTENANCE_DATA}
            process={TypeProcess.MAINTENANCE_CUSTOMER}
            showDifferentDataAlert={false}
          />
        </>
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

export default ConventionalFacilityPage;
