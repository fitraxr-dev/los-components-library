'use client';

import { TypeModule, TypeProcess } from '@/enums/Module';

import BackButton from '@/components/shared/BackButton';
import BaseContainer from '@/components/shared/BaseContainer';
import StepperV2 from '@/components/shared/StepperV2';

import { LpsBastProvider } from './LpsLayoutBast.context';
import useLpsReview from './LpsLayoutBast.hook';


const LpsLayoutBast = ({ children }) => {
  const { renderDetailLayout, isDivisiBisnis, isSuperAdmin, isBackBtn, handleBack, isLpsbd } = useLpsReview();

  const isBastDpop = (!isSuperAdmin && !isDivisiBisnis) || (isSuperAdmin && isLpsbd);

  return (
    <LpsBastProvider>
      {isBackBtn && <BackButton handleClick={handleBack} />}
      <BaseContainer>
        {
          !renderDetailLayout ? (
            <>
              <StepperV2
                process={isBastDpop ? TypeProcess.LPS_BAST_DPOP : TypeProcess.LPS_BAST}
                module={TypeModule.LPS}
              />
            </>
          ) : null
        }
        {children}
      </BaseContainer>
    </LpsBastProvider>
  );
};

export default LpsLayoutBast;
