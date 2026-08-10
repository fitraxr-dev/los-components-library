'use client';
import { TypeModule } from '@/enums/Module';

import BackButton from '@/components/shared/BackButton';
import BaseContainer from '@/components/shared/BaseContainer';
import StepperV2 from '@/components/shared/StepperV2';

import { CreditCheckingProvider } from './CreditChecking.context';
import useCreditChecking from './CreditChecking.hook';


const CreditCheckingLayout = ({ children }) => {
  const {
    renderDetailLayout,
    hideStepper,
    handleBack,
    process,
  } = useCreditChecking();

  return (
    <CreditCheckingProvider>
      {renderDetailLayout ? <BackButton handleClick={handleBack} /> : null}
      <BaseContainer>
        {renderDetailLayout && !hideStepper ? (
          <StepperV2
            process={process}
            module={TypeModule.CREDIT_CHECKING}
          />
        ) : null}
        {children}
      </BaseContainer>
    </CreditCheckingProvider>
  );
};

export default CreditCheckingLayout;
