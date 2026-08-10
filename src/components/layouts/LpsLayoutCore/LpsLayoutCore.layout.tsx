'use client';

import { TypeModule, TypeProcess } from '@/enums/Module';

import BackButton from '@/components/shared/BackButton';
import BaseContainer from '@/components/shared/BaseContainer';
import StepperV2 from '@/components/shared/StepperV2';

import { LpsCoreProvider } from './LpsLayoutCore.context';
import useLpsReview from './LpsLayoutCore.hook';


const LpsLayoutCore = ({ children }) => {
  const { renderDetailLayout, isBackBtn, handleBack } = useLpsReview();

  return (
    <LpsCoreProvider>
      {isBackBtn && <BackButton handleClick={handleBack} />}
      <BaseContainer>
        {
          renderDetailLayout ? (
            <>
              <StepperV2
                process={TypeProcess.LPS_CORE}
                module={TypeModule.LPS}
              />
            </>
          ) : null
        }
        {children}
      </BaseContainer>
    </LpsCoreProvider>
  );
};

export default LpsLayoutCore;
