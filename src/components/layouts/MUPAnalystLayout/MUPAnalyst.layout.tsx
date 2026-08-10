'use client';
import React from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';

import BackButton from '@/components/shared/BackButton';
import BaseContainer from '@/components/shared/BaseContainer';
import StepperV2 from '@/components/shared/StepperV2';

import { MUPProvider } from './MUPAnalyst.context';
import useMUPAnalyst from './MUPAnalyst.hook';


const MUPAnalystLayout = ({ children }) => {
  const {
    renderBackButton,
    renderDetailLayout,
    handleBack,
  } = useMUPAnalyst();


  return (
    <MUPProvider>
      {renderBackButton ? <BackButton handleClick={handleBack} /> : null}
      <BaseContainer>
        {
          renderDetailLayout ? (
            <>
              <StepperV2
                module={TypeModule.MUP}
                process={TypeProcess.MUP_ANALYST}
              />
            </>
          ) : null
        }
        {children}
      </BaseContainer>
    </MUPProvider>
  );
};

export default MUPAnalystLayout;
