'use client';
import { TypeModule } from '@/enums/Module';

import StepperV2 from '@/components/shared/StepperV2';

import BackButton from '../../shared/BackButton';
import BaseContainer from '../../shared/BaseContainer';

import { ApuPptProvider } from './ApuPpt.context';
import useApuPpt from './ApuPpt.hook';


const ApuPptLayout = ({ children }) => {

  const {
    handleBack,
    withStepper,
    withBackButton,
    process,
  } = useApuPpt();

  return (
    <ApuPptProvider>
      {
        withBackButton && <BackButton handleClick={handleBack} />
      }
      <BaseContainer>
        {
          withStepper ? (
            <>
              <StepperV2
                process={process}
                module={TypeModule.APU_PPT}
              />
            </>
          ) : null
        }
        {children}
      </BaseContainer>
    </ApuPptProvider>
  );
};

export default ApuPptLayout;
