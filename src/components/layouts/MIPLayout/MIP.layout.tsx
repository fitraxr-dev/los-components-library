'use client';

import useApp from '@/hooks/useApp';

import { MIPProvider } from '@/components/layouts/MIPLayout/MIP.context';
import BackButton from '@/components/shared/BackButton';
import BaseContainer from '@/components/shared/BaseContainer';
import StepperV2 from '@/components/shared/StepperV2';

import useMIP from './MIP.hook';


const MipLayout = ({ children }) => {
  const [state] = useApp();
  const {
    renderDetailLayout,
    renderBackButton,
    handleBack,
  } = useMIP();

  return (
    <MIPProvider>
      {renderBackButton ? <BackButton handleClick={handleBack} /> : null}
      <BaseContainer>
        {
          renderDetailLayout ? (
            <>
              <StepperV2 module={state.pages.mipModule} process={state.pages.mipProcess} />
            </>
          ) : null
        }
        {children}
      </BaseContainer>
    </MIPProvider>
  );
};

export default MipLayout;
