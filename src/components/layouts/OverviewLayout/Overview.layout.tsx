'use client';

import React from 'react';

import BackButton from '@/components/shared/BackButton';
import BaseContainer from '@/components/shared/BaseContainer';

import { OverviewProvider } from './Overview.context';
import useOverview from './Overview.hook';


const OverviewContent = ({ children }: { children: React.ReactNode }) => {
  const { renderDetailLayout, handleBack, isCreationPage } = useOverview();

  return (
    <>
      {renderDetailLayout ? <BackButton handleClick={handleBack} /> : null}
      {isCreationPage ? children : <BaseContainer>{children}</BaseContainer>}
    </>
  );
};

const OverviewLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <OverviewProvider>
      <OverviewContent>{children}</OverviewContent>
    </OverviewProvider>
  );
};

export default OverviewLayout;
