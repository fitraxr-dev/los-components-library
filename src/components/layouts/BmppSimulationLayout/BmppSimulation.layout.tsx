'use client';
import React from 'react';

import BackButton from '@/components/shared/BackButton';
import BaseContainer from '@/components/shared/BaseContainer';

import { BmppSimulationProvider } from './BmppSimulation.context';
import useBmppSimulationLayout from './BmppSimulation.hook';


const BmppSimulationLayout = ({ children }) => {
  const {
    handleBack,
    withBackButton,
  } = useBmppSimulationLayout();
  return (
    <BmppSimulationProvider>
      {withBackButton && (
        <BackButton handleClick={handleBack} />
      )}
      <BaseContainer>
        {children}
      </BaseContainer>
    </BmppSimulationProvider>

  );
};

export default BmppSimulationLayout;
