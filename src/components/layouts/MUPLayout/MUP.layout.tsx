'use client';
import React from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';

import BackButton from '@/components/shared/BackButton';
import BaseContainer from '@/components/shared/BaseContainer';
import StepperV2 from '@/components/shared/StepperV2';

import { MUPProvider } from './MUP.context';
import useMUP from './MUP.hook';


const MUPLayout = ({ children }) => {
  const {
    renderBackButton,
    renderDetailLayout,
    handleBack,
  } = useMUP();

  return (
    <MUPProvider>
      {renderBackButton ? <BackButton handleClick={handleBack} /> : null}
      <BaseContainer>
        {
          renderDetailLayout ? (
            <>
              <StepperV2
                module={TypeModule.MUP}
                process={TypeProcess.MUP}
              />
            </>
          ) : null
        }
        {children}
      </BaseContainer>
    </MUPProvider>
  );
};

export default MUPLayout;
