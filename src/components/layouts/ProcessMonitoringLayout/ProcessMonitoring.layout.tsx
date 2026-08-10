'use client';

import * as React from 'react';

import BaseContainer from '@/components/shared/BaseContainer';

import { ProcessMonitoringProvider } from './ProcessMonitoring.context';


const ProcessMonitoringLayout = ({ children }: { children: Readonly<React.ReactNode> }) => {
  return (
    <ProcessMonitoringProvider>
      <BaseContainer sx={{ pb: 5 }}>
        {children}
      </BaseContainer>
    </ProcessMonitoringProvider>
  );
};

export default ProcessMonitoringLayout;
