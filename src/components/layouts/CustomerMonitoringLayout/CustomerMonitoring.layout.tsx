'use client';

import * as React from 'react';

import BaseContainer from '@/components/shared/BaseContainer';

import { CustomerMonitoringProvider } from './CustomerMonitoring.context';


const CustomerMonitoringLayout = ({ children }: { children: Readonly<React.ReactNode> }) => {
  return (
    <CustomerMonitoringProvider>
      <BaseContainer sx={{ pb: 5 }}>
        {children}
      </BaseContainer>
    </CustomerMonitoringProvider>
  );
};

export default CustomerMonitoringLayout;
