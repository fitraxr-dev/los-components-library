'use client';

import React from 'react';

import { useTheme } from '@mui/material';

import { TypeModule, TypeProcess } from '@/enums/Module';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Tabs, { TabItem } from '@/components/shared/Tabs';
import Title from '@/components/shared/Title';

import TabGroup from '../components/TabGroup';
import TabIndividual from '../components/TabIndividual';

import { tab } from './BmppMonitoring.constants';
import useBmppMonitoringPage from './BmppMonitoring.hook';

import type { ReactNode } from 'react';


const BmppMonitoringPage = () => {
  const theme = useTheme();

  const {
    activeTab,
    handleChangeTab,
    tabs,
  } = useBmppMonitoringPage();

  const TabWrapper = ({ children }: {children: ReactNode}) => {
    return (
      <ColumnWrapper gap={theme.spacing(3)}>
        {children}
      </ColumnWrapper>
    );
  };

  return (
    <ColumnWrapper sx={{ gap: theme.spacing(3) }}>
      <Title title="BMPP Monitoring" />
      <Tabs
        activeTab={activeTab}
        onChange={(val: string) => handleChangeTab(val)}
        items={tabs}
      />

      <TabItem activeValue={activeTab} value={tab.INDIVIDUAL}>
        <TabWrapper>
          <TabIndividual />
        </TabWrapper>
      </TabItem>

      <TabItem activeValue={activeTab} value={tab.GROUP}>
        <TabWrapper>
          <TabGroup />
        </TabWrapper>
      </TabItem>

    </ColumnWrapper>
  );

  return {};
};

export default BmppMonitoringPage;
