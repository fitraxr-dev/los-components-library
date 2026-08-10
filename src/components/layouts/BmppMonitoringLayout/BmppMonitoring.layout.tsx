'use client';
import React from 'react';

import BackButton from '@/components/shared/BackButton';
import BaseContainer from '@/components/shared/BaseContainer';

import { BmppMonitoringProvider } from './BmppMonitoring.context';
import useBmppMonitoringLayout from './BmppMonitoring.hook';
import BreadCrumb from './components/BreadCrumb';


const BmppMonitoringLayout = ({ children }) => {
  const {
    handleBack,
  } = useBmppMonitoringLayout();
  return (
    <BmppMonitoringProvider>
      <BreadCrumb />
      <BaseContainer sx={{ gap: 2 }}>
        {children}
      </BaseContainer>
    </BmppMonitoringProvider>

  );
};

export default BmppMonitoringLayout;
