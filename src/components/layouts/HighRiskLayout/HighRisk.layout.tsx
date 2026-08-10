'use client';

import { TypeModule, TypeProcess } from '@/enums/Module';

import BackButton from '@/components/shared/BackButton';
import BaseContainer from '@/components/shared/BaseContainer';
import StepperV2 from '@/components/shared/StepperV2';

import ConfimationHistory from './components/ConfimationHistory';
import ValidationModal from './components/ValidationModal';
import { HighRiskProvider } from './HighRisk.context';
import useHighRisk from './HighRisk.hook';


const HighRiskLayout = ({ children }) => {
  const {
    debtorId,
    handleBack,
    renderBackButton,
    renderDetailLayout,
  } = useHighRisk();

  return (
    <HighRiskProvider>
      {/* {renderDetailLayout && debtorId && <ValidationModal debtorId={debtorId} />} */}
      {renderBackButton ? <BackButton handleClick={handleBack} /> : null}
      {renderDetailLayout && <ConfimationHistory />}
      <BaseContainer>
        {
          renderDetailLayout ? (
            <>
              <StepperV2
                module={TypeModule.HIGH_RISK}
                process={TypeProcess.HIGH_RISK_DK}
              />
            </>
          ) : null
        }
        {children}
      </BaseContainer>
    </HighRiskProvider>
  );
};

export default HighRiskLayout;
